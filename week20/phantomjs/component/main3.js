class Div {}

function createElement(Cls, attributes) {
  console.log(arguments);

  let obj = new Cls();

  // 将attributes转移到obj上
  for (const name in attributes) {
    obj[name] = attributes[name];
  }

  return obj;
}

// https://reactjs.org/docs/introducing-jsx.html
// 如果Div为大写，在createElement中打印出class Div
let component = <Div id='a' class='b' />; // arguments: 0: ƒ Div(), 1: {id: "a", class: "b"}
// 如果div为小写，在createElement中打印出字符串
// let component2 = <div id='a' class='b' />; // arguments:: 0: "div", 1: {id: "a", class: "b"}
