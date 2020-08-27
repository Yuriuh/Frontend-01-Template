function createElement(Cls, attributes, ...children) {
  console.log(arguments); // 如果没有设置属性时，arguments[1]为null

  let obj = new Cls();

  // 将attributes转移到obj上
  for (const name in attributes) {
    obj[name] = attributes[name];
  }

  console.log(children);

  return obj;
}

// 用户代码
class Parent {
  // 获取class属性
  set class(value) {
    console.log('Parent set class', value);
  }
}

// 用户代码
class Child {}

// https://reactjs.org/docs/introducing-jsx.html
// 此时调用createElement的顺序为1.Child,2.Child,3.Child,4:Parent
// 在JSX中，组件树构建顺序是子元素->父元素
let component = (
  // Parent在createElement中会传入参数：0: ƒ Parent(), 1: {id: "a", class: "b"}, 2: Child {}, 3: Child {}, 4: Child {}
  <Parent id='a' class='b'>
    {/* Child在createElement中会传入参数：0: ƒ Child(), 1: null */}
    <Child></Child>
    <Child></Child>
    <Child></Child>
  </Parent>
);

component.class = 'c'; // 也会触发Parent中的set class
