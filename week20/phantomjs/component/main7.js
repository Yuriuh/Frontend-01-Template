function createElement(Cls, attributes, ...children) {
  console.log(arguments); // 如果没有设置属性时，arguments[1]为null

  let element = new Cls({
    // 此处传入Config
    config: 'config',
  });

  // 将attributes转移到obj上
  for (const name in attributes) {
    // 此处可以把attributes设置到obj中
    element.setAttribute(name, attributes[name]);
  }

  console.log(children);
  // 将children挂载到obj
  for (const child of children) {
    // 如果不用appendChild方法，也可以直接push到children，这主要看设计者的思想
    // element.children.push(child);
    element.appendChild(child);
  }

  return element;
}

// 用户代码
class Parent {
  constructor(config) {
    console.log('config', config);
    // 存储Children
    this.children = [];
    // 创建一个DOM元素
    this.root = document.createElement('div');
  }

  // 获取class属性
  set class(value) {
    // property
    console.log('Parent set class', value);
  }

  set id(value) {
    console.log('Parent set id', value);
  }

  setAttribute(name, value) {
    // attribute
    console.log(name, value);
    // 在DOM元素上插入属性
    this.root.setAttribute(name, value);
  }

  // 通过appendChild，挂载子组件
  appendChild(child) {
    // children
    console.log(this.root);
    console.log(child);
    child.mountTo(this.root);
  }

  // 当前节点插入将渲染到页面
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

// 用户代码
class Child {
  constructor(config) {
    console.log('config', config);
    // 存储Children
    this.children = [];
    // 创建一个DOM元素
    this.root = document.createElement('div');
  }

  // 获取class属性
  set class(value) {
    // property
    console.log('Parent set class', value);
  }

  set id(value) {
    console.log('Parent set id', value);
  }

  setAttribute(name, value) {
    // attribute
    console.log(name, value);
    // 在DOM元素上插入属性
    this.root.setAttribute(name, value);
  }

  // 通过appendChild，挂载子组件
  appendChild(child) {
    // children
    console.log(this.root);
    console.log(child);
    child.mountTo(this.root);
  }

  // 当前节点插入将渲染到页面
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

// https://reactjs.org/docs/introducing-jsx.html
// 此时调用createElement的顺序为1.Child,2.Child,3.Child,4:Parent
// 在JSX中，组件树构建顺序是子元素->父元素
let component = (
  // Parent在createElement中会传入参数：0: ƒ Parent(), 1: {id: "a", class: "b"}, 2: Child {}, 3: Child {}, 4: Child {}
  <Parent id='a' class='b'>
    {/* Child在createElement中会传入参数：0: ƒ Child(), 1: null */}
    <Child>
      <Child></Child>
    </Child>
    <Child></Child>
    <Child></Child>
  </Parent>
);

component.class = 'c'; // 也会触发Parent中的set class

component.mountTo(document.body);
