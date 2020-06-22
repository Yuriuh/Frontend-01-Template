# 每周总结可以写在这里

我在异步编程之红绿灯问题的回调地狱的例子中，封装和抽象了一下 winter 老师的代码，这让我想到一个问题 —— 抽象与复用

问题1：在抽象带来的好处与坏之间处如何做出权衡
- 工作中常常会面临抽象与复用的问题
- 想抽象和复用一些代码逻辑，但需要考虑通用性和一些边缘情况，会花大量时间；
- 过度抽象又容易造成代码不清晰，难以理解
- 不抽象又会写很多冗余的代码

问题2: 有一些说法，一个函数一般控制在 5 到 10 行比较合理，不然的话就考虑把函数里面的一些逻辑抽象出来封装, winter 老师怎么看待这个说法

```javascript
// 星期四准备在课上提问, 复制这段代码
const lights = document.querySelectorAll('.round')
const greenLight = document.querySelector('.green')
const redLight = document.querySelector('.red')
const yellowLight = document.querySelector('.yellow')

function removeLightAll() {
  for (let i = 0; i < lights.length; i++) {
    const light = lights[i]
    light.classList.remove('light')
  }
}

function lighten(lightElem) {
  removeLightAll()
  lightElem.classList.add('light')
}

function startLightLoop() {
  lighten(greenLight)
  setTimeout(() => {
    lighten(yellowLight)
    setTimeout(() => {
      lighten(redLight)
      setTimeout(() => {
        startLightLoop()
      }, 1000 * 5)
    }, 1000 * 2)
  }, 1000 * 10)
}

startLightLoop()
```