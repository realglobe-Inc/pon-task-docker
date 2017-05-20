/**
 * Test case for define.
 * Runs with mocha.
 */
'use strict'

const define = require('../lib/define.js')
const ponContext = require('pon-context')
const { ok } = require('assert')
const co = require('co')

describe('define', function () {
  this.timeout(500000)

  before(() => co(function * () {

  }))

  after(() => co(function * () {

  }))

  it('Define', () => co(function * () {
    let ctx = ponContext()
    let task = define({
      mysql: [ 'some-mysql-container-name' ]
    })
    ok(task)

    const { mysql } = task
    yield mysql.run(ctx)
    yield mysql.logs(ctx)
    yield mysql.remove(ctx)
  }))
})

/* global describe, before, after, it */
