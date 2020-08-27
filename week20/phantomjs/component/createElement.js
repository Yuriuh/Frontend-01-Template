import {enableGesture} from './gesture';

export function createElement(Cls, attributes, ...children) {
  // console.log(arguments); // 如果没有设置属性时，arguments[1]为null

  let element;

  if (typeof Cls === 'string') {
    element = new Wrapper(Cls, {
      // 此处传入Config
      config: 'wrapperConfig',
    });
  } else {
    element = new Cls({
      // 此处传入Config
      config: 'elementConfig',
    });
  }

  // 将attributes转移到obj上
  for (const name in attributes) {
    // 此处可以把attributes设置到obj中
    element.setAttribute(name, attributes[name]);
  }

  let visit = (children) => {
    // console.log(children);
    // 将children挂载到obj
    for (const child of children) {
      // 如果子元素为数组，即需要用map遍历时，需要递归遍历
      if (typeof child === 'object' && child instanceof Array) {
        visit(child);
      } else if (typeof child === 'string') {
        child = new Text(child);
      }
      // 如果不用appendChild方法，也可以直接push到children，这主要看设计者的思想
      // element.children.push(child);
      if (!Array.isArray(child)) {
        element.appendChild(child);
      }
    }
  };

  visit(children);

  return element;
}

// html组件
export class Wrapper {
  constructor(type, config) {
    // console.log('config', config);
    // 存储Children
    this.children = [];
    // 创建一个DOM元素
    this.root = document.createElement(type);
  }

  setAttribute(name, value) {
    // attribute
    // console.log(name, value);
    // 在DOM元素上插入属性
    if (name === 'style' && typeof value === 'object') {
      for (const prop in value) {
        this.root.style[prop] = value[prop];
      }
    } else {
      this.root.setAttribute(name, value);

      if (name.match(/^on([\s\S]+)$/)) {
        let eventName = RegExp.$1.replace(/^[\s\S]/, (c) => c.toLowerCase());
        this.addEventListener(eventName, value);
      }

      if (name === 'enableGesture') {
        enableGesture(this.root);
      }
    }
  }
  getAttribute(name) {
    return this.root.getAttribute(name);
  }

  // 绑定事件
  addEventListener() {
    this.root.addEventListener(...arguments);
  }

  get style() {
    return this.root.style;
  }

  get classList() {
    return this.root.classList;
  }

  set innerText(text) {
    return (this.root.innerText = text);
  }

  // 通过appendChild，存储子组件
  appendChild(child) {
    // children
    // console.log(this.root);
    // console.log(child);
    this.children.push(child);
  }

  // 当前节点插入将渲染到页面
  mountTo(parent) {
    parent.appendChild(this.root);

    for (const child of this.children) {
      child.mountTo(this.root);
    }
  }
}

// 文本组件
export class Text {
  constructor(text) {
    this.root = document.createTextNode(text);
  }

  mountTo(parent) {
    parent.appendChild(this.root);
  }

  geAttribute(name) {
    return name;
  }
}
