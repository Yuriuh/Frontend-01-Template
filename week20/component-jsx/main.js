import { createElement, Text, Wrapper } from './utils/createElement'

const div = <div>
  <span>hello world</span>
</div>

div.mountTo(document.body)