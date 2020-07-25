const parser = require('./parser')

module.exports = function(source, map) {
  const tree = parser.parseHTML(source)

  let template = null
  let script = null

  for (const node of tree.children) {
    if (node.tagName === 'template') {
      template = node.children.filter(e => e.type !== 'text')[0]
    }
    if (node.tagName === 'script') {
      script = node.children[0].content
    }
  }

  let visit = (node, depth) => {
    if (node.type === 'text') {
      return JSON.stringify(node.content)
    }
    const attrs = {}
    for (const attribute of node.attributes) {
      attrs[attribute.name] = attribute.value
    }
    const children = node.children.map(node => visit(node))
    return `createElement('${node.tagName}', ${JSON.stringify(attrs)}, ${children})`
  }
  visit(template, 0)

  let result = `
    import { createElement, Text, Wrapper } from './utils/createElement'
    export class Carousel {
      render() {
        return ${visit(template)}
      }
      setAttribute(name, value) {
        this[name] = value
      }
      mountTo(parent) {
        console.log('this.render', this.render)
        this.render().mountTo(parent)
      }
    }
  `
  console.log('result', result)
  return result
}