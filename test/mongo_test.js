/**
 * Test case for mongo.
 * Runs with mocha.
 */
'use strict'

const mongo = require('../lib/mongo.js')
const {equal, ok} = require('assert')
const ponContext = require('pon-context')
const aport = require('aport')
const asleep = require('asleep')

describe('mongo', function () {
  this.timeout(300000)

  before(async () => {

  })

  after(async () => {

  })

  it('Mongo', async () => {
    const ctx = ponContext()
    const port = await aport()
    const task = mongo('pon-task-docker-test-mongo-01', {
      varDir: `${__dirname}/../tmp/test-mongo`,
      publish: `${port}:8081`
    })
    const {run, remove, stop, logs} = task

    await run(ctx)
    await asleep(300)
    await logs(ctx)
    await stop(ctx)
    await remove(ctx)
  })
})

/* global describe, before, after, it */
