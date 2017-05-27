/**
 * Run node
 * @function node
 * @param {string} name - Container name
 * @param {Object} [options={}] - Optional settings
 */
'use strict'

const adockerNginx = require('adocker-node')
const co = require('co')
const asleep = require('asleep')

/** @lends node */
function node (name, options = {}) {
  let {
    tag = 'myapp',
    image = 'node:latest',
    network = 'default',
    publish = false,
    mountDir = process.cwd(),
    NODE_ENV = 'production',
    aptModules = [],
    npmGlobalModules = [ 'yarn', 'pon', 'pm2' ],
    run: runLines = [],
    cmd = [ 'pm2', './bin/app.js' ]
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
    tag,
    image,
    network,
    publish,
    mountDir,
    NODE_ENV,
    aptModules,
    npmGlobalModules,
    run: runLines,
    cmd
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

module.exports = node
