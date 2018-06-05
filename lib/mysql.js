/**
 * Run mysql
 * @function mysql
 * @param {string} name - Container name
 * @param {Object} [options={}] - Optional settings
 */
'use strict'

const adockerMysql = require('adocker-mysql')
const asleep = require('asleep')

/** @lends mysql */
function mysql (name, options = {}) {
  const {
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
    hasContainer,
    isRunning,
    stop,
    remove,
    terminal
  } = adockerMysql(name, {
    image,
    rootPassword,
    varDir,
    publish,
    network,
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
        await start(name)
      } else {
        await run()
      }
      // Wait for mysql server to startup
      await asleep(11 * 1000)
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

module.exports = mysql
