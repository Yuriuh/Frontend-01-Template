const css = require('css')
// const layout = require('./layout1')
const layout = require('./layout')

const EOF = Symbol('EOF') // EOF: End Of File
const TAG_NAME_REG = /^[a-zA-Z]$/
const WHITE_SPACE_REG = /^[\t\n\f ]$/

let currentToken = null
let currentAttribute = null
let currentTextNode = null
let stack = [{ type: 'document', children: [] }]

const rules = []

// 获取一个 style 标签里面的所有规则
function addCSSRules(text) {
  const ast = css.parse(text)
  rules.push(...ast.stylesheet.rules)
}

// 可以扩展成实现复合选择器，实现支持空格的 class 选择器
function match(element, selector) {
  if (!selector || !element.attributes) {
    return false
  }
  if (selector.charAt(0) === '#') {
    const attr = element.attributes.filter(attr => attr.name === 'id')[0]
    if (attr && attr.value === selector.replace('#', '')) {
      return true
    }
  } else if (selector.charAt(0) === '.') {
    const attr = element.attributes.filter(attr => attr.name === 'class')[0]
    if (attr && attr.value === selector.replace('.', '')) {
      return true
    } else {
      if (element.tagName === selector) {
        return true
      }
    }
  }
}

function specificity(selector) {
  const p = [0, 0, 0, 0]
  const selectorParts = selector.split(' ')
  for (const part of selectorParts) {
    if (part.charAt(0) === '#') {
      p[1] += 1
    } else if (part.charAt(0) === '.') {
      p[2] += 1
    } else {
      p[3] += 1
    }
  }
  return p
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0]
  }
  if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1]
  }
  if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2]
  }
  return sp1[3] - sp2[3]
}

function computeCSS(element) {
  const elements = stack.slice().reverse()
  if (!element.computedStyle) {
    element.computedStyle = {}
  }

  for (const rule of rules) {
    const selectorParts = rule.selectors[0].split(' ').reverse()

    if (!match(element, selectorParts[0])) {
      continue
    }

    let matched = false
    let j = 1
    for (let i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j += 1
      }
    }

    if (j >= selectorParts.length) {
      matched = true
    }

    if (matched) {
      const sp = specificity(rule.selectors[0])
      const computedStyle = element.computedStyle
      for (const declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {}
        }

        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value
          computedStyle[declaration.property].specificity = sp
        } else if ( compare(computedStyle[declaration.property].specificity, sp) < 0 ) {
          computedStyle[declaration.property].value = declaration.value
          computedStyle[declaration.property].specificity = sp
        }
      }
      // console.log('computedStyle', element.computedStyle)
    }
  }

}

function emit(token) {
  let top = stack[stack.length - 1]

  if (token.type === 'startTag') {
    const element = {
      type: 'element',
      children: [],
      attributes: [],
    }

    element.tagName = token.tagName

    for (const p in token) {
      // 不应该是 ||
      if (p !== 'type' && p !== 'tagName') {
        element.attributes.push({
          name: p,
          value: token[p],
        })
      }
    }

    // 很讲究
    computeCSS(element)

    top.children.push(element)
    // element.parent = top

    if (!token.isSelfClosing) {
      stack.push(element)
    }

    currentTextNode = null

  } else if (token.type === 'endTag') {
    if (top.tagName !== token.tagName) {
      throw new Error('Tag start end doesn\'t match!')
    } else {
      if (top.tagName === 'style') {
        addCSSRules(top.children[0].content)
      }
      stack.pop()
    }
    layout(top)
    currentTextNode = null

  } else if (token.type === 'text') {
    if (currentTextNode === null) {
      currentTextNode = {
        type: 'text',
        content: '',
      }
      top.children.push(currentTextNode)
    }
    currentTextNode.content += token.content
  }
}

function data(c) {
  if (c === '<') {
    return tagOpen
  } else if (c === EOF) {
    emit({ type: 'EOF' })
    return
  } else {
    emit({
      type: 'text',
      content: c
    })
    return data
  }
}

function tagOpen(c) {
  if (c === '/') {
    return endTagOpen
  } else if (c.match(TAG_NAME_REG)) {
    currentToken = {
      type: 'startTag',
      tagName: '',
    }
    return tagName(c)
  } else {
    emit({
      type: 'text',
      content: c
    })
    // return data(c)
    return
  }
}

function tagName(c) {
  if (c.match(WHITE_SPACE_REG)) {
    return beforeAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c.match(TAG_NAME_REG)) {
    currentToken.tagName += c
    return tagName
  } else if (c === '>') {
    // 一个标签结束，回到 data 继续解析
    emit(currentToken)
    return data
  } else {
    currentToken.tagName += c
    return tagName
  }
}

function beforeAttributeName(c) {
  if (c.match(WHITE_SPACE_REG)) {
    // 持续吃掉空格
    return beforeAttributeName
  } else if (c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c)
  } else if (c === '=') {

  } else {
    currentAttribute = {
      name: '',
      value: '',
    }
    return attributeName(c)
  }
}

function attributeName(c) {
  if (c.match(WHITE_SPACE_REG) || c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c)
  } else if (c === '=') {
    return beforeAttributeValue
  } else if (c === '\u0000') {

  } else if (c === '\"' || c === '\'' || c === '<') {

  } else {
    currentAttribute.name += c
    return attributeName
  }
}

function beforeAttributeValue(c) {
  if (c.match(WHITE_SPACE_REG) || c === '/' || c === '>' || c === EOF) {
    return beforeAttributeValue
  } else if (c === '\"') {
    return doubleQuotedAttributeValue
  } else if (c === '\'') {
    return singleQuotedAttributeValue
  } else if (c === '>') {
    return data
  } else {
    return unquotedAttributeValue(c)
  }
}

function doubleQuotedAttributeValue(c) {
  if (c === '\"') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if (c === '\u0000') {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

function singleQuotedAttributeValue(c) {
  if (c === '\'') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  } else if (c === '\u0000') {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

function afterQuotedAttributeValue(c) {
  if (c.match(WHITE_SPACE_REG)) {
    return beforeAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (c === EOF) {

  } else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

function unquotedAttributeValue(c) {
  if (c.match(WHITE_SPACE_REG)) {
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeName
  } else if (c === '/') {
    currentToken[currentAttribute.name] = currentAttribute.value
    return selfClosingStartTag
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (c === '\u0000') {

  } else if (c === '\"' || c === '\'' || c === '<' || c === '=' || c === '`') {

  } else if (c === EOF) {

  } else {
    currentAttribute.value += c
    return unquotedAttributeValue
  }
}

function selfClosingStartTag(c) {
  if (c === '>') {
    currentToken.isSelfClosing = true
    emit(currentToken)
    return data
  } else if (c === 'EOF') {

  } else {

  }
}

function endTagOpen(c) {
  if (c.match(TAG_NAME_REG)) {
    currentToken = {
      type: 'endTag',
      tagName: '',
    }
    return tagName(c)
  } else if (c === '>') {

  } else if (c === EOF) {

  } else {

  }
}

function afterAttributeName(c) {
  if (c.match(WHITE_SPACE_REG)) {
    return afterAttributeName
  } else if (c === '/') {
    return selfClosingStartTag
  } else if (c === '=') {
    return beforeAttributeValue
  } else if (c === '>') {
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  } else if (c === EOF) {

  } else {
    currentToken[currentAttribute.name] = currentAttribute.value
    currentAttribute = {
      name: '',
      value: '',
    }
    return attributeName(c)
  }
}

function parseHTML(html) {
  let state = data
  for (const c of html) {
    state = state(c)
  }
  state = state(EOF)
  return stack[0]
}

module.exports.parseHTML = parseHTML