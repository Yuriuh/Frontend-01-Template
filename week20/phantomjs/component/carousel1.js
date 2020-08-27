function createElement(Cls, attributes, ...children) {
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
    // element.setAttribute(name, attributes[name]);
    element[name] = attributes[name];
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
      element.appendChild(child);
    }
  };

  visit(children);

  return element;
}

// html组件
class Wrapper {
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
    }
  }

  // 绑定事件
  addEventListener() {
    this.root.addEventListener(...arguments);
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
class Text {
  constructor(text) {
    this.root = document.createTextNode(text);
  }

  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

// 普通组件
class Carousel {
  constructor() {
    // console.log('config', config);
    // 存储Children
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
  }

  setAttribute(name, value) {
    this.attributes.set(name, value);
  }

  // 通过appendChild，存储子组件
  appendChild(child) {
    this.children.push(child);
  }

  render() {
    return (
      <div>
        {this.data.map((url) => {
          let element = <img src={url} />;
          element.addEventListener('dragstart', (event) =>
            event.preventDefault(),
          );
          return element;
        })}
      </div>
    );
  }

  // 当前节点插入将渲染到页面
  mountTo(parent) {
    this.slot = <div></div>;

    for (const child of this.children) {
      this.slot.appendChild(child);
    }

    this.render().mountTo(parent);
  }
}

// https://reactjs.org/docs/introducing-jsx.html
// 此时调用createElement的顺序为1.Child,2.Child,3.Child,4:Div
// 在JSX中，组件树构建顺序是子元素->父元素
let component = (
  <Carousel
    data={[
      'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
      'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
      'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
      'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
    ]}
  />
);

component.class = 'c'; // 也会触发Div中的set class

// 将组件及其子组件渲染到#root
component.mountTo(document.querySelector('#root'));
