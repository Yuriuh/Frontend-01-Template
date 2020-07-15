// 函数名为 webpack.config.js pragma 配置的名字
function createElement(Cls, attributes, ...children) {
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

  for (const child of children) {
    // 处理文本节点
    if (typeof child === 'string') {
      child = new Text(child)
    }
    o.appendChild(child)
  }

  return o
}

// 处理文本节点
class Text {
  constructor(text) {
    this.children = []
    this.root = document.createTextNode(text)
  }
  mountTo(parent) {
    parent.appendChild(this.root)
  }
}

// 处理标签小写的情况
class Wrapper {
  constructor(type) {
    this.children = []
    this.root = document.createElement(type)
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }

  appendChild(child) {
    this.children.push(child)
  }

  mountTo(parent) {
    parent.appendChild(this.root)
    for (const child of this.children) {
      child.mountTo(this.root)
    }
  }
}

// 处理标签大写的情况
class Div {
  constructor(config) {
    this.children = []
    this.root = document.createElement('div')
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }

  appendChild(child) {
    this.children.push(child)
  }

  mountTo(parent) {
    parent.appendChild(this.root)
    for (const child of this.children) {
      child.mountTo(this.root)
    }
  }
}

class MyComponent {
  constructor() {
    this.children = []
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }

  appendChild(child) {
    this.children.push(child)
  }

  render() {
    return <div>
      { this.slot }
    </div>
  }

  mountTo(parent) {
    // 这个地方能不能用 DocumentFragment ?
    this.slot = <div></div>
    for (const child of this.children) {
      this.slot.appendChild(child)
    }
    this.render().mountTo(parent)
  }
}

let component = <div id="parent" class="papa" style="background: pink; padding: 16px;">
  <div>111</div>
  <div>222</div>
  <div>333</div>
  <MyComponent>
    <Div>My component</Div>
  </MyComponent>
</div>

component.mountTo(document.body)

// let component = createElement(
//   Div,
//   {
//     id: 'parent',
//     class: 'papa'
//   },
//   createElement(Div, null),
//   createElement(Div, null),
//   createElement(Div, null)
// )

console.log('component', component)
