import { enableGesture } from "./gesture"

// 函数名为 webpack.config.js pragma 配置的名字
export function createElement(Cls, attributes, ...children) {
  let o

  if (typeof Cls === 'string') {
    o = new Wrapper(Cls)
  } else {
    o = new Cls({
      timer: {}
    })
  }

  for (const name in attributes) {
    o.setAttribute(name, attributes[name])
  }

  const visit = (children) => {
    for (const child of children) {
      // 处理数组
      if (Array.isArray(child)) {
        visit(child)
        continue
      }
      // 处理文本节点
      if (typeof child === 'string') {
        child = new Text(child)
      }
      o.appendChild(child)
    }
  }

  visit(children)

  return o
}

// 处理文本节点
export class Text {
  constructor(text) {
    this.children = []
    this.root = document.createTextNode(text)
  }

  mountTo(parent) {
    parent.appendChild(this.root)
  }

  getAttribute() {
    return ''
  }
}

// 处理标签小写的情况
export class Wrapper {
  constructor(type) {
    this.children = []
    this.root = document.createElement(type)
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value)

    if ( name.match(/^on([\s\S]+)$/) ) {
      const eventName = RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase())
      this.addEventListener(eventName, value)
    }

    if (name === 'enableGesture') {
      enableGesture(this.root)
    }
  }

  getAttribute(name) {
    return this.root.getAttribute(name)
  }

  appendChild(child) {
    this.children.push(child)
  }

  addEventListener() {
    this.root.addEventListener(...arguments)
  }

  get style() {
    return this.root.style
  }

  get classList() {
    return this.root.classList
  }

  set innerText(text) {
    return this.root.innerText = text
  }

  mountTo(parent) {
    parent.appendChild(this.root)
    for (const child of this.children) {
      child.mountTo(this.root)
    }
  }
}