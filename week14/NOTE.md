# 组件

## 基本概念

- state (end user input)
- attribute (component user's markup code) 强调描述性, 在 HTML 和 JS 中都可以设置
- property (component user's js code) 强调从属关系, 只能在 JS 中设置
- method
- event
- lifecycle
  - created
  - ...
  - destroyed
- children

## 例子
- Carousel

  - state
    - activeIndex

  - property
    - autoplay
    - color
    - forward

  - attribute
    - startIndex
    - loop time
    - imgList

  - children
    - 2 种风格

  - event
    - change
    - click
    - dbclick
    - hover
    - swipe
    - resize

  - method
    - next()
    - prev()
    - goto()
    - play()
    - stop()

- CarouselView