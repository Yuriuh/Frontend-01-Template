import assert from 'assert'
import { add } from '../src/add'

describe('Add function', function () {
  describe('1 + 2', function () {
    it('should return 3 when 1 + 2', function () {
      assert.equal(add(1, 2), 3)
    })
  })
})