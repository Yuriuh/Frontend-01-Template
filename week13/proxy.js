// const target = {
//   msg1: 'hello',
//   msg2: 'everyone',
// }

// const handle1 =  {}

// const proxy1 = new Proxy(target, handle1)

// console.log(proxy1.msg1)
// console.log(proxy1.msg2)

const obj = {
  a: 1,
  b: 2,
}

const proxy = new Proxy(obj, {
  get(obj, prop) {
    console.log(obj, prop)
  }
})