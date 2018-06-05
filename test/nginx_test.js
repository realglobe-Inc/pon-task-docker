/**
 * Test case for nginx.
 * Runs with mocha.
 */
'use strict'

const nginx = require('../lib/nginx.js')
const {equal, ok} = require('assert')
const ponContext = require('pon-context')
const aport = require('aport')
const asleep = require('asleep')
const arequest = require('arequest')

describe('nginx', function () {
  this.timeout(300000)

  before(async () => {

  })

  after(async () => {

  })

  it('Nginx', async () => {
    const ctx = ponContext()
    const port = await aport()
    const task = nginx('pon-task-docker-nginx-test-01', {
      template: `${__dirname}/../misc/mocks/nginx.conf.template`,
      staticDir: `${__dirname}/../misc/mocks/mock-public`,
      httpPublishPort: port,
      localhostAs: '10.0.2.2'
    })

    let {run, remove, logs, stop} = task

    await run(ctx)

    let {statusCode, body} = await arequest(`http://localhost:${port}/index.html`)
    equal(statusCode, 200)
    ok(body)

    await logs(ctx)

    await stop(ctx)

    await remove(ctx)
  })
})

/* global describe, before, after, it */
