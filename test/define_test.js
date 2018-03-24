/**
 * Test case for define.
 * Runs with mocha.
 */
'use strict'

const define = require('../lib/define.js')
const ponContext = require('pon-context')
const {ok} = require('assert')

describe('define', function () {
  this.timeout(5000000)

  before(async () => {

  })

  after(async () => {

  })

  it('Define', async () => {
    const ctx = ponContext()
    const task = define('pon-task-docker-test-01',{
      image: 'hello-world'
    })
    ok(task)
    await task.run(ctx)
    await task.logs(ctx)
    await task.remove(ctx)

  })
})

/* global describe, before, after, it */
