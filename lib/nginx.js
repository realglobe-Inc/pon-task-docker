/**
 * Run nginx
 * @function nginx
 * @param {string} name - Container name
 * @param {Object} [options={}] - Optional settings
 */
'use strict'

const adockerNginx = require('adocker-nginx')
const co = require('co')
const asleep = require('asleep')

/** @lends nginx */
function nginx (name, options = {}) {
  let {
    image = 'nginx:latest',
    cwd = process.cwd(),
    network = 'default',
    httpPort = 80,
    httpPublishPort = false,
    httpsPort = 443,
    httpsPublishPort = false,
    template = 'nginx.conf.template',
    cert = false,
    staticDir = 'public',
    env = {},
    localhostAs = '10.0.2.2'
  } = options

  const {
    run,
    logs,
    start,
    hasContainer,
    isRunning,
    stop,
    remove
  } = adockerNginx(name, {
    image,
    cwd,
    network,
    httpPort,
    httpPublishPort,
    httpsPort,
    httpsPublishPort,
    template,
    cert,
    staticDir,
    env,
    localhostAs
  })

  function task (ctx) {
    return co(function * () {
      return task.run(ctx)
    })
  }

  Object.assign(task, {
    run (ctx) {
      const { logger } = ctx
      return co(function * () {
        if (yield isRunning()) {
          logger.debug(`"${name}" is already running`)
          return
        }
        if (yield hasContainer()) {
          yield start()
        } else {
          yield run()
        }
        // Wait for server to startup
        yield asleep(3 * 1000)
      })
    },
    logs (ctx) {
      return co(function * () {
        yield logs()
      })
    },
    start (ctx) {
      return co(function * () {
        yield start()
      })
    },
    stop (ctx) {
      return co(function * () {
        yield stop()
      })
    },
    remove (ctx) {
      return co(function * () {
        yield remove({ force: true })
      })
    }
  })

  return task
}

module.exports = nginx
