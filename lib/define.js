/**
 * Define task
 * @function define
 * @param {Object} [options={}] - Optional settings
 * @returns {function} Defined task
 */
'use strict'

const {
  logs, run, start, stop, remove,
  inspect
} = require('adocker/commands')
const uuid = require('uuid')
const asleep = require('asleep')
const redis = require('./redis')
const nginx = require('./nginx')
const mysql = require('./mysql')
const node = require('./node')

const subPacks = {mysql, redis, nginx, node}

/** @lends define */
function define (name = uuid.v4(), options = {}) {
  const {
    image = 'hello-world',
    env = {},
    volumes = {},
    ports = {},
    detach = true,
    network = 'default',
  } = options

  const isRunning = () => inspect(name).then(([info]) => Boolean(info && info.State.Running))
  const hasContainer = () => inspect(name).then(([info]) => !!info)

  function task (ctx) {
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
        await run({
          name,
          network,
          publish: Object.entries(ports).map(([published, inside]) => `${published}:${inside}`),
          volume: Object.entries(volumes).map(([hosted, inside]) => `${hosted}:${inside}`),
          env: Object.keys(env).map((name) => [name, env[name]].join('=')),
          detach,
        }, image)
      }
      // Wait for server to startup
      await asleep(3 * 1000)
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
      await remove(name, {force: true})
    },
  })
  return task
}

module.exports = Object.assign(define, subPacks)
