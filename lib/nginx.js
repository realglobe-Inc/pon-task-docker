/**
 * Run nginx
 * @function nginx
 * @param {string} name - Container name
 * @param {Object} [options={}] - Optional settings
 */
'use strict'

const adockerNginx = require('adocker-nginx')
const asleep = require('asleep')

/** @lends nginx */
function nginx (name, options = {}) {
  const {
    image = 'nginx:latest',
    cwd = process.cwd(),
    network = 'default',
    httpPort = 80,
    httpPublishPort = false,
    httpsPort = 443,
    httpsPublishPort = false,
    template = 'nginx.conf.template',
    cert = false,
    certKey = false,
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
    certKey,
    staticDir,
    env,
    localhostAs
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

module.exports = nginx
