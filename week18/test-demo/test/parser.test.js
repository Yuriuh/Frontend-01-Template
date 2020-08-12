import assert from 'assert'
import { parseHTML } from '../src/parser'

// describe('Parse a single element', function () {
//   let ast1
//   let div1
//   beforeEach(function () {
    // ast1 = parseHTML('<div></div>')
    // div1 = ast1.children[0]
//   })
//   it('the first children is div', function () {
//     console.log('div1', div1)
//     assert.equal(div1.tagName, 'div')
//   })
//   it('the children length of div should be zero', function () {
//     assert.equal(div1.children.length, 0)
//   })
//   it('the type of div should be element', function () {
//     assert.equal(div1.type, 'element')
//   })
//   it('the attributes length of div should be zero', function () {
//     assert.equal(div1.attributes.length, 0)
//   })
// })

describe.only('Parse html function', () => {
  it('Parse a single element', () => {
    var ast = parseHTML('<div></div>')
    var div = ast.children[0]
    assert.equal(div.tagName, 'div')
    assert.equal(div.children.length, 0)
    assert.equal(div.type, 'element')
    assert.equal(div.attributes.length, 0)
  })

  it('Parse a single element with text content', () => {
    var ast = parseHTML('<div>Hello</div>')
    var div = ast.children[0]
    var text = div.children[0]
    assert.equal(text.content, 'Hello')
    assert.equal(text.type, 'text')
  })

  it('tag mismatch', () => {
    try {
      var ast = parseHTML('<div></vid>')
    } catch (error) {
      assert.equal(error.message, 'Tag start end doesn\'t match!')
    }
  })

  it('text with <', () => {
    var ast = parseHTML('<div>a < b</div>')
    var text = ast.children[0].children[0]
    assert.equal(text.content, 'a < b')
    assert.equal(text.type, 'text')
  })

  it('with property', () => {
    var ast = parseHTML('<div id=a class=\'b\' data="c"></div>')
    var div = ast.children[0]
    var count = 0

    for (const attr of div.attributes) {
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
        console.log('attr value', attr.value)
        assert.equal(attr.value, 'c')
      }
    }
  })
})