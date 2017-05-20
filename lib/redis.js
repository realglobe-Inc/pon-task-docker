/**
 * Run redis
 * @function redis
 * @param {string} name - Container name
 * @param {Object} [options={}] - Optional settings
 */
'use strict'

const adockerRedis = require('adocker-redis')
const co = require('co')

/** @lends redis */
function redis (name, options = {}) {
  let {
    image = 'redis:latest',
    rootPassword = 'root',
    dataDir = 'var/redis',
    publish = false,
    network = 'default'
  } = options

  const {
    run,
    logs,
    start,
    isRunning,
    stop,
    remove,
    terminal
  } = adockerRedis(name, {
    image,
    rootPassword,
    dataDir,
    publish,
    network
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
        yield run()
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
    },
    terminal (ctx) {
      return co(function * () {
        yield terminal()
      })
    }
  })

  return task
}

module.exports = redis
