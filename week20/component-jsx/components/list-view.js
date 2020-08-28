import { createElement, Text, Wrapper } from '../utils/createElement'

export class ListView {
  constructor(config) {
    this.children = []
    this.attributes = new Map()
    this.properties = new Map()
  }

  setAttribute(name, value) {
    this[name] = value
  }

  getAttribute(name) {
    return this[name]
  }

  appendChild(child) {
    this.children.push(child)
  }

  render() {
    const data = this.getAttribute('data')
    return (
      <div class="list-view">
        {
          data.map(this.children[0])
        }
      </div>
    )
  }

  mountTo(parent) {
    this.render().mountTo(parent)
  }
}