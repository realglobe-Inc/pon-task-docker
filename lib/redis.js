/**
 * Run redis
 * @function redis
 * @param {string} name - Container name
 * @param {Object} [options={}] - Optional settings
 */
'use strict'

const adockerRedis = require('adocker-redis')
const asleep = require('asleep')

/** @lends redis */
function redis (name, options = {}) {
  const {
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
    hasContainer,
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

  async function task (ctx) {
    return task.run(ctx)
  }

  Object.assign(task, {
    async run (ctx) {
      const {logger} = ctx
      if (await isRunning()) {
        logger.debug(`"${name}" is already running`)
        return
      }
      if (await hasContainer()) {
        await start()
      } else {
        await run()
      }
      // Wait for server to startup
      await asleep(3 * 1000)
    },
    async logs (ctx) {
      await logs()
    },
    async start (ctx) {
      await start()
    },
    async stop (ctx) {
      await stop()
    },
    async remove (ctx) {
      await remove({force: true})
    },
    async terminal (ctx) {
      await terminal()
    }
  })

  return task
}

module.exports = redis
