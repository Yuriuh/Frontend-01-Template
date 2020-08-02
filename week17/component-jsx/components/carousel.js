import { createElement, Text, Wrapper } from '../utils/createElement'
import { ease } from '../utils/cubicBezier'
import { Timeline, Animation } from '../utils/animation'
import { enableGesture } from '../utils/gesture'
import css from './carousel.css'

export class Carousel {
  constructor(config) {
    this.children = []
    this.attributes = new Map()
    this.properties = new Map()
  }

  setAttribute(name, value) {
    this[name] = value
  }

  appendChild(child) {
    this.children.push(child)
  }

  render() {
    const timeline = new Timeline()
    timeline.start()

    let position = 0

    let nextPicStopHandler = null

    const children = this.data.map((url, currentPosition) => {
      let lastPosition = (currentPosition - 1 + this.data.length) % this.data.length
      let nextPosition = (currentPosition + 1) % this.data.length

      let offset = 0

      const onStart = () => {
        console.log('start')
        timeline.pause()
        clearTimeout(nextPicStopHandler)
        const currentElement = children[currentPosition]
        // console.log('currentElement', currentElement)
        const currentTransformValue = Number(currentElement.style.transform.match(/translateX\(([\s\S]+)px\)/)[1])
        offset = currentTransformValue + (500 * currentPosition)
      }
      const onPan = event => {
        // console.log('onPan')
        const lastElement = children[lastPosition]
        const currentElement = children[currentPosition]
        const nextElement = children[nextPosition]

        const dx = event.detail.clientX - event.detail.startX
        console.log('dx', dx)
        const lastTransformValue = -500 - (500 * lastPosition) + offset + dx
        const currentTransformValue = (-500 * currentPosition) + offset  + dx
        const nextTransformValue = 500 - (500 * nextPosition) + offset + dx

        lastElement.style.transform = `translateX(${lastTransformValue}px)`
        currentElement.style.transform = `translateX(${currentTransformValue}px)`
        nextElement.style.transform = `translateX(${nextTransformValue}px)`
      }
      const onPanend = event => {
        console.log('panend')
        let direction = 0
        const dx = event.detail.clientX - event.detail.startX

        console.log('event isFlick', event.detail.isFlick)

        if (dx + offset > 250 || (dx > 0 && event.detail.isFlick)) {
          direction = 1
        } else if (dx + offset < -250 || (dx < 0 && event.detail.isFlick)) {
          direction = -1
        }
        timeline.reset()
        timeline.start()

        const lastElement = children[lastPosition];
        const currentElement = children[currentPosition];
        const nextElement = children[nextPosition]

        const lastAnimation = new Animation({
          object: lastElement.style,
          property: 'transform',
          start: -500 - 500 * lastPosition + offset + dx,
          end: -500 - 500 * lastPosition + direction * 500,
          duration: 500,
          delay: 0,
          timingFunction: ease,
          template: v => `translateX(${v}px)`,
        })

        const currentAnimation = new Animation({
          object: currentElement.style,
          template: v => `translateX(${v}px)`,
          property: 'transform',
          start: -500 * currentPosition + offset + dx,
          end: -500 * currentPosition + direction * 500,
          duration: 500,
          delay: 0,
          timingFunction: ease,
        })

        const nextAnimation = new Animation({
          object: nextElement.style,
          template: v => `translateX(${v}px)`,
          property: 'transform',
          start: 500 - 500 * nextPosition + offset + dx,
          end: 500 - 500 * nextPosition + direction * 500,
          duration: 500,
          delay: 0,
          timingFunction: ease,
        })

        timeline.add(lastAnimation)
        timeline.add(currentAnimation)
        timeline.add(nextAnimation)

        position = (position - direction + this.data.length) % this.data.length
        nextPicStopHandler = setTimeout(nextPic, 3000)
      }
      let element = <img src={url} onStart={onStart} onPan={onPan} onPanend={onPanend} enableGesture={true} />
      element.style.transform = 'translateX(0px)'
      element.addEventListener('dragstart', e => e.preventDefault())
      return element
    })

    let nextPic = () => {
      let nextPosition = (position + 1) % this.data.length

      let current = children[position]
      let next = children[nextPosition]

      let currentAnimation = new Animation({
        object: current.style,
        template: v => `translateX(${5 * v}px)`,
        property: 'transform',
        start: -100 * position,
        end: -100 - 100 * position,
        duration: 500,
        delay: 0,
        timingFunction: ease,
      })

      let nextAnimation = new Animation({
        object: next.style,
        template: v => `translateX(${5 * v}px)`,
        property: 'transform',
        start: 100 - (100 * nextPosition),
        end: -100 * nextPosition,
        duration: 500,
        delay: 0,
        timingFunction: ease,
      })

      timeline.add(currentAnimation)
      timeline.add(nextAnimation)

      position = nextPosition
      nextPicStopHandler = setTimeout(nextPic, 3000)
    }

    nextPicStopHandler = setTimeout(nextPic, 3000)

    return <div class="carousel">
      { children }
    </div>
  }

  mountTo(parent) {
    this.render().mountTo(parent)
  }
}