/**
 * Run mysql
 * @function mysql
 * @param {string} name - Container name
 * @param {Object} [options={}] - Optional settings
 */
'use strict'

const adockerMysql = require('adocker-mysql')
const co = require('co')
const asleep = require('asleep')

/** @lends mysql */
function mysql (name, options = {}) {
  let {
    image = 'mysql:latest',
    rootPassword = 'root',
    varDir = 'var/mysql',
    publish = false,
    network = 'default'
  } = options

  const {
    run,
    logs,
    start,
    hasBuild,
    isRunning,
    stop,
    remove,
    terminal
  } = adockerMysql(name, {
    image,
    rootPassword,
    varDir,
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
        if (yield hasBuild()) {
          yield start()
        } else {
          yield run()
        }
        // Wait for mysql server to startup
        yield asleep(11 * 1000)
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

module.exports = mysql
