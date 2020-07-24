// const images = require('images')

// function render(viewport, element) {
//   if (element.style) {
//     const { width, height, left, top } = element.style
//     const img = images(width, height)

//     if (element.style['background-color']) {
//       const color = element.style['background-color'] || 'rgb(0, 0, 0)'
//       color.match(/rgb\((\d+),(\d+),(\d+)\)/)
//       img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3), 1)
//       viewport.draw(img, left || 0, top || 0)
//     }
//   }

//   if (element.children) {
//     for (const child of element.children) {
//       console.log('child', child)
//       render(viewport, child)
//     }
//   }
// }

// function render(viewport, element) {
//   if (element.style) {
//     let img = images(element.style.width, element.style.height)

//     if (element.style['background-color']) {
//       let color = element.style['background-color'] || 'rgb(0, 0, 0)'
//       color.match(/rgb\((\d+),(\d+),(\d+)\)/)
//       img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3), 1)
//       viewport.draw(img, element.style.left || 0, element.style.top || 0)
//     }
//   }

//   if (element.children) {
//     for (const child of element.children) {
//       console.log('child', child)
//       render(viewport, child)
//     }
//   }
// }

const images = require('images')

function render(viewport, element) {
  if (element.style) {
    var img = images(element.style.width, element.style.height)

    if (element.style['background-color']) {
      let color = element.style['background-color'] || 'rgb(0,0,0)'
      color.match(/rgb\((\d+),(\d+),(\d+)\)/)
      img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3), 1)
      viewport.draw(img, element.style.left || 0, element.style.top || 0)
    }
  }
  if (element.children) {
    for (const child of element.children) {
      render(viewport, child)
    }
  }
}

module.exports = render