/**
 * Test case for network.
 * Runs with mocha.
 */
'use strict'

const network = require('../lib/network.js')
const assert = require('assert')
const ponContext = require('pon-context')

describe('network', function () {
  this.timeout(3000)

  before(async () => {

  })

  after(async () => {

  })

  it('Network', async () => {
    const ctx = ponContext()
    const task = network('pon-docker-test-network')

    await task.create(ctx)
    await task.create(ctx)
    await task.destroy(ctx)
  })
})

/* global describe, before, after, it */
