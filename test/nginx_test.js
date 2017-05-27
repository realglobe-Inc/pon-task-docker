/**
 * Test case for nginx.
 * Runs with mocha.
 */
'use strict'

const nginx = require('../lib/nginx.js')
const { equal, ok } = require('assert')
const ponContext = require('pon-context')
const aport = require('aport')
const asleep = require('asleep')
const arequest = require('arequest')

const co = require('co')

describe('nginx', function () {
  this.timeout(300000)

  before(() => co(function * () {

  }))

  after(() => co(function * () {

  }))

  it('Nginx', () => co(function * () {
    let ctx = ponContext()
    let port = yield aport()
    let task = nginx('adocker-nginx-test-01', {
      template: `${__dirname}/../misc/mocks/nginx.conf.template`,
      staticDir: `${__dirname}/../misc/mocks/mock-public`,
      httpPublishPort: port,
      localhostAs: '10.0.2.2'
    })

    let { run, remove, logs, stop } = task

    yield run(ctx)

    let { statusCode, body } = yield arequest(`http://localhost:${port}/index.html`)
    equal(statusCode, 200)
    ok(body)

    yield logs(ctx)

    yield stop(ctx)

    yield remove(ctx)
  }))
})

/* global describe, before, after, it */
