/**
 * @function mongo
 * @param {string} name - Container name
 * @param {Object} [options={}] - Optional settings
 * @returns {function} Defined task
 */
'use strict'

const {
  logs, remove, run, exec,
  start, stop, inspect
} = require('adocker/commands')
const uriBuilder = require('mongo-uri-builder')
const {cleanup} = require('asobj')
const path = require('path')
const {mkdirpAsync} = require('asfs')

const handleError = (err) => {
  console.error(err)
  process.exit(1)
}

/** @lends mongo */
function mongo (name, options = {}) {
  const {
    image = 'mongo:latest',
    varDir = 'var/mongo',
    network = 'default',
    rootUsername = 'root',
    rootPassword = 'root',
    publish = false,
    onError = handleError,
    cwd = process.cwd(),
  } = options

  const isRunning = async () => inspect(name).then(([info]) => Boolean(info && info.State.Running))
  const hasContainer = async () => inspect(name).then(([info]) => !!info)

  const bundle = {
    async run (ctx) {
      const {logger} = ctx
      if (await isRunning()) {
        logger.debug(`"${name}" is already running`)
        return
      }
      if (await hasContainer()) {
        await start()
        return
      }
      await mkdirpAsync(varDir)
      await run({
        name,
        network,
        publish,
        env: [
          `MONGO_INITDB_ROOT_USERNAME=${rootUsername}`,
          `MONGO_INITDB_ROOT_PASSWORD=${rootPassword}`,
        ],
        volume: `${path.resolve(varDir)}:/data/db`,
        detach: true
      }, image)
    },
    async logs (ctx) {
      await logs(name)
    },
    async start (ctx) {
      await start(name)
    },
    async stop (ctx) {
      await stop(name)
    },
    async remove (ctx) {
      await remove(name)
    },
    async terminal (ctx) {
      await exec({
        interactive: true,
        tty: true,
      }, name, 'mongo')
    }
  }

  async function task (ctx) {
    return bundle.run(ctx)
  }

  return Object.assign(task, bundle)
}

module.exports = mongo