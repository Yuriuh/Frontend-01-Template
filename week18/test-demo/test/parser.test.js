import assert from 'assert'
import { parseHTML } from '../src/parser'

describe('Parse html function', () => {
  it('Parse a single element', () => {
    var doc = parseHTML('<div></div>')
    var div = doc.children[0]
    assert.equal(div.tagName, 'div')
    assert.equal(div.children.length, 0)
    assert.equal(div.type, 'element')
    assert.equal(div.attributes.length, 0)
  })

  it('Parse a single element with text content', () => {
    var doc = parseHTML('<div>Hello</div>')
    var div = doc.children[0]
    var text = div.children[0]
    assert.equal(text.content, 'Hello')
    assert.equal(text.type, 'text')
  })

  it('tag mismatch', () => {
    try {
      var doc = parseHTML('<div></vid>')
    } catch (error) {
      assert.equal(error.message, 'Tag start end doesn\'t match!')
    }
  })

  it('text with <', () => {
    var doc = parseHTML('<div>a < b</div>')
    var text = doc.children[0].children[0]
    assert.equal(text.content, 'a < b')
    assert.equal(text.type, 'text')
  })

  it('with property1', () => {
    var doc = parseHTML(`<div id=a class='b' data="c" ></div>`)
    var div = doc.children[0]
    var count = 0

    for (var attr of div.attributes) {
      if (attr.name === 'id') {
        count += 1
        assert.equal(attr.value, 'a')
      }
      if (attr.name === 'class') {
        count += 1
        assert.equal(attr.value, 'b')
      }
      if (attr.name === 'data') {
        count += 1
        assert.equal(attr.value, 'c')
      }
    }
    assert.ok(count === 3)
  })

  it('with property2', () => {
    var doc = parseHTML(`<div id=a class='b' data="c"></div>`)
    var div = doc.children[0]
    var count = 0

    for (var attr of div.attributes) {
      if (attr.name === 'id') {
        count += 1
        assert.equal(attr.value, 'a')
      }
      if (attr.name === 'class') {
        count += 1
        assert.equal(attr.value, 'b')
      }
      if (attr.name === 'data') {
        count += 1
        assert.equal(attr.value, 'c')
      }
    }
    assert.ok(count === 3)
  })

  it('with property3', () => {
    var doc = parseHTML(`<div id=a class='b'data="c"></div>`)
    var div = doc.children[0]
    var count = 0

    for (var attr of div.attributes) {
      if (attr.name === 'id') {
        count += 1
        assert.equal(attr.value, 'a')
      }
      if (attr.name === 'class') {
        count += 1
        assert.equal(attr.value, 'b')
      }
      if (attr.name === 'data') {
        count += 1
        assert.equal(attr.value, 'c')
      }
    }
    assert.ok(count === 3)
  })

  it('script', () => {
    var content = parseHTML(`
      <script>
        <div>abc</div>
        <span>def</span>
      /script>
      <script>
      <
      </
      </scr
      </scri
      </scrip
      </script
      </script>
    `)
    var doc = parseHTML(`<script>${content}</script>`)
    var text = doc.children[0].children[0]
    assert.equal(text.content, content)
    assert.equal(text.type, 'text')
  })

  it('attribute with no value', () => {
    var doc = parseHTML(`<div class></div>`)
    var div = doc.children[0]
    var count = 0

    for (var attr of div.attributes) {
      if (attr.name === 'class') {
        count += 1
        assert.equal(attr.value, '')
      }
    }

    assert.ok(count === 1)
  })

  it('attribute with no value2', () => {
    var doc = parseHTML(`<div class id/>`)
    var div = doc.children[0]
    var count = 0

    for (var attr of div.attributes) {
      if (attr.name === 'class') {
        count += 1
        assert.equal(attr.value, '')
      }
      if (attr.name === 'id') {
        count += 1
        assert.equal(attr.value, '')
      }
    }

    assert.ok(count === 2)
  })

  it('self closed single element', () => {
    var doc = parseHTML('<img/>')
    var img = doc.children[0]

    assert.equal(img.tagName, 'img')
    assert.equal(img.type, 'element')
  })

  it('self closed single element with an end space', () => {
    var doc = parseHTML('<img />')
    var img = doc.children[0]

    assert.equal(img.tagName, 'img')
    assert.equal(img.type, 'element')
  })

  it('self closed single element with multiple end spaces', () => {
    var doc = parseHTML('<img   />')
    var img = doc.children[0]

    assert.equal(img.tagName, 'img')
    assert.equal(img.type, 'element')
  })

  it('upercase tagname element', () => {
    var doc = parseHTML('<DIV></DIV>')
    var div = doc.children[0]

    assert.equal(div.tagName, 'DIV')
    assert.equal(div.type, 'element')
  })

  it('upercase self closing element', () => {
    var doc = parseHTML('<IMG />')
    var img = doc.children[0]

    assert.equal(img.tagName, 'IMG')
    assert.equal(img.type, 'element')
  })

  it('empty tagname element', () => {
    var doc = parseHTML('<></>')
    var text = doc.children[0]

    assert.equal(text.content, '<>')
    assert.equal(text.type, 'text')
  })
})