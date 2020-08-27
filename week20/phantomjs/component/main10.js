function createElement(Cls, attributes, ...children) {
  console.log(arguments); // 如果没有设置属性时，arguments[1]为null

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
class Div {
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
    console.log('Div set class', value);
  }

  set id(value) {
    console.log('Div set id', value);
  }

  setAttribute(name, value) {
    // attribute
    console.log(name, value);
    // 在DOM元素上插入属性
    if (name === 'style' && typeof value === 'object') {
      for (const prop in value) {
        this.root.style[prop] = value[prop];
      }
    } else {
      this.root.setAttribute(name, value);
    }
  }

  // 通过appendChild，存储子组件
  appendChild(child) {
    // children
    console.log(this.root);
    console.log(child);
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

//
class Wrapper {
  constructor(type, config) {
    console.log('config', config);
    // 存储Children
    this.children = [];
    // 创建一个DOM元素
    this.root = document.createElement(type);
  }

  // 获取class属性
  set class(value) {
    // property
    console.log('Div set class', value);
  }

  set id(value) {
    console.log('Div set id', value);
  }

  setAttribute(name, value) {
    // attribute
    console.log(name, value);
    // 在DOM元素上插入属性
    if (name === 'style' && typeof value === 'object') {
      for (const prop in value) {
        this.root.style[prop] = value[prop];
      }
    } else {
      this.root.setAttribute(name, value);
    }
  }

  // 通过appendChild，存储子组件
  appendChild(child) {
    // children
    console.log(this.root);
    console.log(child);
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

// https://reactjs.org/docs/introducing-jsx.html
// 此时调用createElement的顺序为1.Child,2.Child,3.Child,4:Div
// 在JSX中，组件树构建顺序是子元素->父元素
let component = (
  // Div在createElement中会传入参数：0: ƒ Div(), 1: {id: "a", class: "b"}, 2: Child {}, 3: Child {}, 4: Child {}
  <Div
    id='a'
    class='b'
    style={{width: '100px', height: '100px', backgroundColor: 'lightgreen'}}
  >
    {/* Child在createElement中会传入参数：0: ƒ Child(), 1: null */}
    <Div>
      <Div></Div>
    </Div>
    <Div></Div>
    <Div></Div>
    <div></div>
    <span>
      <strong></strong>
    </span>
    <p></p>
  </Div>
);

component.class = 'c'; // 也会触发Div中的set class

// 将组件及其子组件渲染到#root
component.mountTo(document.querySelector('#root'));
