/**
 * 红绿灯问题
 * 一个路口的红绿灯，会按照绿灯亮10秒，黄灯亮2秒，红灯亮5秒的顺序
 * 无限循环，请编写JS代码来控制这个红绿灯
 */
var light = ''

function changeColor(color) {
  light = color
  console.log('颜色', color)
}

function startLoop() {
  changeColor('红')
  setTimeout(() => {
    changeColor('黄')
    setTimeout(() => {
      changeColor('绿')
      setTimeout(() => {
        startLoop()
      }, 1000 * 5)
    }, 1000 * 2)
  }, 1000 * 10)
}

startLoop()