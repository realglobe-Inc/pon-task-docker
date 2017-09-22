/**
 * Run node
 * @function node
 * @param {string} name - Container name
 * @param {Object} [options={}] - Optional settings
 */
'use strict'

const adockerNode = require('adocker-node')
const asleep = require('asleep')

/** @lends node */
function node (name, options = {}) {
  const {
    tag = 'myapp',
    image = 'node:latest',
    network = 'default',
    publish = false,
    mountDir = process.cwd(),
    NODE_ENV = 'production',
    aptModules = [],
    npmGlobalModules = ['yarn', 'pon', 'pm2'],
    run: runLines = [],
    cmd = ['pm2', './bin/app.js']
  } = options

  const {
    run,
    logs,
    start,
    hasContainer,
    isRunning,
    stop,
    remove
  } = adockerNode(name, {
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
    }
  })

  return task
}

module.exports = node
