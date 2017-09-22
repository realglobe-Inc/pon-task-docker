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
    const task = define({
      mysql: ['some-mysql-container-name'],
      redis: ['some-redis-container-name'],
      nginx: ['some-nginx-container-name'],
      node: ['some-node-container-name']
    })
    ok(task)

    const {mysql, redis} = task
    await mysql.run(ctx)
    await mysql.logs(ctx)
    await mysql.remove(ctx)

    await redis.run(ctx)
    await redis.logs(ctx)
    await redis.remove(ctx)
  })
})

/* global describe, before, after, it */
