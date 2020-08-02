import { createElement, Text, Wrapper } from '../utils/createElement'

export class TabPanel {
  constructor(config) {
    this.children = []
    this.attributes = new Map()
    this.properties = new Map()
  }

  setAttribute(name, value) {
    this[name] = value
  }

  getAttribute(name) {
    return this[name]
  }

  appendChild(child) {
    this.children.push(child)
  }

  select(i) {
    for (const view of this.childViews) {
      view.style.display = 'none'
    }
    this.childViews[i].style.display = ''

    for (const view of this.titleViews) {
      view.classList.remove('selected')
    }
    this.titleViews[i].classList.add('selected')
  }

  render() {
    this.childViews = this.children.map(child => <div style="min-height: 300px;">{ child }</div>)
    this.titleViews = this.children.map((child, i) => {
      return (
        <span onClick={() => this.select(i)} style="padding: 5px 5px 0px 5px; font-size: 24px; cursor: pointer;">
          { child.getAttribute('title') || '' }
        </span>
      )
    })

    setTimeout(() => {
      this.select(1)
    }, 16)

    return <div class="panel" style="border: 1px solid lightgreen; width: 300px;">
      <h1 style="background: lightgreen; margin: 0;">
        { this.titleViews }
      </h1>
      <div>
        { this.childViews }
      </div>
    </div>
  }

  mountTo(parent) {
    this.render().mountTo(parent)
  }
}