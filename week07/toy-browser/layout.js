function getStyle(element) {
  if (!element.style) {
    element.style = {}
  }

  for (const prop in element.computedStyle) {
    element.style[prop] = element.computedStyle[prop].value

    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop])
    }

    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(element.style[prop])
    }
  }
  return element.style
}

function layout(element) {
  if (!element.computedStyle) {
    return
  }

  const elementStyle = getStyle(element)

  if (elementStyle.display !== 'flex') {
    return
  }

  let items = element.children.filter(e => e.type === 'element')

  items.sort((a, b) => {
    return (a.order || 0) - (b.order || 0)
  })

  const style = elementStyle
  const sizes = ['width', 'height']

  sizes.forEach(size => {
    if (style[size] === 'auto' || style[size] === '') {
      style[size] = null
    }
  })

  if (!style['flex-direction'] || style['flex-direction'] === 'auto') {
    style['flex-direction'] = 'row'
  }
  if (!style['align-items'] || style['align-items'] === 'auto') {
    style['align-items'] = 'stretch'
  }
  if (!style['justify-content'] || style['justify-content'] === 'auto') {
    style['justify-content'] = 'flex-start'
  }
  if (!style['flex-wrap'] || style['flex-wrap'] === 'auto') {
    style['flex-wrap'] = 'nowrap'
  }
  if (!style['align-content'] || style['align-content'] === 'auto') {
    style['align-content'] = 'stretch'
  }

  let mainSize
  let mainStart
  let mainEnd
  let mainSign
  let mainBase
  let crossSize
  let crossStart
  let crossEnd
  let crossSign
  let crossBase

  if (style['flex-direction'] === 'row') {
    mainSize = 'width'
    mainStart = 'left'
    mainEnd = 'right'
    mainSign = +1
    mainBase = 0

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }
  else if (style['flex-direction'] === 'row-reverse') {
    mainSize = 'width'
    mainStart = 'right'
    mainEnd = 'left'
    mainSign = -1
    mainBase = style.width

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }
  else if (style['flex-direction'] === 'column') {
    mainSize = 'height'
    mainStart = 'top'
    mainEnd = 'bottom'
    mainSign = +1
    mainBase = 0

    crossSize = 'width'
    crossStart = 'left'
    crossEnd = 'right'
  }
  else if (style['flex-direction'] === 'column-reverse') {
    mainSize = 'height'
    mainStart = 'bottom'
    mainEnd = 'top'
    mainSign = -1
    mainBase = style.height

    crossSize = 'width'
    crossStart = 'left'
    crossEnd = 'right'
  }

  if (style['flex-wrap'] === 'wrap-reverse') {
    // 换个方向
    const temp = crossStart
    crossStart = crossEnd
    crossEnd = temp
    crossSign = -1
  } else {
    crossBase = 0
    crossSign = 1
  }

  // 是否由子元素决定主轴 宽/高
  let isAutoMainSize = false
  if (!style[mainSize]) {
    elementStyle[mainSize] = 0
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const itemStyle = getStyle(item)
      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
        elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize]
      }
      isAutoMainSize = true
    }
  }

  const flexLine = []
  const flexLines = [ flexLine ]

  let mainSpace = elementStyle[mainSize]
  let crossSpace = 0

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const itemStyle = getStyle(item)

    if (itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0
    }

    if (itemStyle.flex) {
      flexLine.push(item)
    } else if (style['flex-wrap'] === 'nowrap' && isAutoMainSize) {
      // 元素没给宽度，真实情况下可能 100% 父级宽度
      // 这里当 inline-flex 处理
      mainSpace -= itemStyle[mainSize]
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }
      flexLine.push(item)
    } else {
      // 子元素宽度超过父元素
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize]
      }
      if (mainSpace < itemStyle[mainSize]) {
        // 起新行给当前 行/列 剩余空间和交叉轴 高/宽 赋值
        flexLine.mainSpace = mainSpace
        flexLine.crossSpace = crossSpace
        // 另起一 行/列
        flexLine = [item]
        flexLines.push(flexLine)
        mainSpace = style[mainSize]
        crossSpace = 0
      } else {
        flexLine.push(item)
      }
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }
      mainSpace -= itemStyle[mainSize]
    }
  }
  flexLine.mainSpace = mainSpace

  if (style['flex-wrap'] === 'nowrap'|| isAutoMainSize) {
    flexLine.crossSpace = (style[crossSize] !== undefined)
      ? style[crossSize]
      : crossSpace
  } else {
    flexLine.crossSpace = crossSpace
  }

  if (mainSpace < 0) {
    // overflow (happens only if container is single file), scale every item
    const scale = style[mainSize] / (style[mainSize] - mainSpace)
    let currentMain = mainBase
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const itemStyle = getStyle(item)

      if (itemStyle.flex) {
        itemStyle[mainSize] = 0
      }

      itemStyle[mainSize] = itemStyle[mainSize] * scale

      itemStyle[mainStart] = currentMain
      itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
      currentMain = itemStyle[mainEnd]
    }
  } else {
    flexLines.forEach(items => {
      const mainSpace = items.mainSpace
      let flexTotal = 0
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const itemStyle = getStyle(item)

        if ((itemStyle.flex !== null) && (itemStyle.flex !== (void 0))) {
          flexTotal += itemStyle.flex
          continue
        }
      }

      if (flexTotal > 0) {
        // There is flexible flex items
        let currentMain = mainBase
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          const itemStyle = getStyle(item)

          if (itemStyle.flex) {
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex
          }
          itemStyle[mainStart] = currentMain
          itemStyle[mainEnd] = itemStyle[mainStart] + (mainSign * itemStyle[mainSize])
          currentMain = itemStyle[mainEnd]
        }
      } else {
        // There is *NO* flexible flex items, which meas,['justify-content'] should work
        let currentMain
        let step
        if (style['justify-content'] === 'flex-start') {
          currentMain = mainBase
          step = 0
        }
        if (style['justify-content'] === 'flex-end') {
          currentMain = (mainSpace * mainSign) + mainBase
          step = 0
        }
        if (style['justify-content'] === 'center') {
          currentMain = (mainSpace / 2 * mainSign) + mainBase
          step = 0
        }
        if (style['justify-content'] === 'space-between') {
          step = mainSpace / (items.length - 1) * mainSign
          currentMain = mainBase
        }
        if (style['justify-content'] === 'space-aaround') {
          step = mainSpace / item.length * mainSign
          currentMain = (step / 2) + mainBase
        }
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          const itemStyle = getStyle(item)
          itemStyle[mainStart] = currentMain
          itemStyle[mainEnd] = itemStyle[mainStart] + (itemStyle[mainSize] * mainSign)
          currentMain = itemStyle[mainEnd] + step
        }
      }
    })
  }

  // compute the cross axis sizes
  // align-items, align-self
  // let crossSpace

  if (!style[crossSize]) {
    crossSpace = 0
    elementStyle[crossSize] = 0
    for (let i = 0; i < flexLines.length; i++) {
      elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace
    }
  } else {
    crossSpace = style[crossSize]
    for (let i = 0; i < flexLines.length; i++) {
      crossSpace -= flexLines[i].crossSpace
    }
  }

  if (style['flex-wrap'] === 'wrap-reverse') {
    crossBase = style[crossSize]
  } else {
    crossBase = 0
  }

  // const lineSize = style[crossSize] / flexLines.length
  let step

  if (style['align-content'] === 'flex-start') {
    crossBase += 0
    step = 0
  }
  if (style['align-content'] === 'flex-end'){
    crossBase += crossSpace * crossSign
    step = 0
  }
  if (style['align-content'] === 'center') {
    crossBase += (crossSpace / 2) * crossSign
    step = 0
  }
  if (style['align-content'] === 'space-between') {
    crossBase += 0
    step = crossSpace / (flexLines.length - 1)
  }
  if (style['align-content'] === 'space-around') {
    step = crossSpace / flexLines.length
    crossBase += (step / 2) * crossSign
  }
  if (style['align-content'] === 'stretch') {
    crossBase += 0
    step = 0
  }
  flexLines.forEach(items => {
    let lineCrossSize = style['align-content'] === 'stretch'
      ? items.crossSpace + (crossSpace / flexLines.length)
      : items.crossSpace

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const itemStyle = getStyle(item)

      const align = itemStyle.alignSelf || style['align-items']

      if (itemStyle[crossSize] === null) {
        itemStyle[crossSize] = align === 'stretch'
          ? lineCrossSize
          : 0
      }

      if (align === 'flex-start') {
        itemStyle[crossStart] = crossBase
        itemStyle[crossEnd] = itemStyle[crossStart] + (crossSign * itemStyle[crossSize])
      }
      if (align === 'flex-end') {
        itemStyle[crossStart] = crossBase
        itemStyle[crossEnd] = crossBase + (crossSign * lineCrossSize)
      }
      if (align === 'center') {
        itemStyle[crossStart] = crossBase + (crossSign * (lineCrossSize - itemStyle[crossSize]) / 2)
        itemStyle[crossEnd] = itemStyle[crossStart]
      }
      if (align === 'stretch') {
        const temp = (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0))
          ? itemStyle[crossSize]
          : lineCrossSize

        itemStyle[crossStart] = crossBase
        itemStyle[crossEnd] = crossBase + crossSign * temp
        itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
      }
    }
    crossBase += crossSign * (lineCrossSize + step)
  })
  console.log('items', items)
}

module.exports = layout