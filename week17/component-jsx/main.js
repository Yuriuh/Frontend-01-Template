import { createElement, Text, Wrapper } from './utils/createElement'
import { Carousel } from './components/carousel'
import { Panel } from './components/panel'
import { TabPanel } from './components/tab-panel'
import { ListView } from './components/list-view'

const carousel = <Carousel data={[
  'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
  'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
  'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
  'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
]}>
</Carousel>

const panel = <Panel title="This is my panel">
  <div>This is content</div>
</Panel>

const tabPanel = <TabPanel title="This is my panel">
  <div title="title1">This is content1</div>
  <div title="title2">This is content2</div>
  <div title="title3">This is content3</div>
</TabPanel>

const data = [
  {
    title: '蓝猫',
    url: 'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg'
  },
  {
    title: '橘猫加白',
    url: 'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg'
  },
  {
    title: '狸花加白',
    url: 'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg'
  },
  {
    title: '橘猫',
    url: 'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
  },
]

const listView = <ListView data={ data }>
  {record => <figure>
      <img src={ record.url } />
      <figcaption>
        { record.title }
      </figcaption>
  </figure>}
</ListView>

carousel.mountTo(document.body)
// panel.mountTo(document.body)
// tabPanel.mountTo(document.body)
// listView.mountTo(document.body)