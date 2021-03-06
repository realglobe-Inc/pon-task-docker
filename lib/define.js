/**
 * Define task
 * @function define
 * @param {Object} [options={}] - Optional settings
 * @returns {function} Defined task
 */
'use strict'

const {
  build,
  logs,
  run,
  start,
  stop,
  remove,
  inspect
} = require('adocker/commands')
const adocker = require('adocker')
const uuid = require('uuid')
const asleep = require('asleep')
const redis = require('./redis')
const mongo = require('./mongo')
const network = require('./network')
const nginx = require('./nginx')
const mysql = require('./mysql')
const node = require('./node')

const subPacks = {mysql, redis, nginx, node, network, mongo}

/** @lends define */
function define (name = uuid.v4(), options = {}) {
  const {
    image = 'hello-world',
    env = {},
    volumes = {},
    ports = {},
    detach = true,
    network = 'default',
    dockerfile = null,
  } = options

  const isRunning = () => inspect(name).then(([info]) => Boolean(info && info.State.Running))
  const hasContainer = () => inspect(name).then(([info]) => !!info)

  function task (ctx) {
    return task.run(ctx)
  }

  Object.assign(task, {
    async build (ctx) {
      const {logger} = ctx
      await adocker('build', '-t', image, dockerfile)
    },
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
