/**
 * Run mysql
 * @function mysql
 * @param {Object} [options] - Optional settings
 */
'use strict'

const adockerMysql = require('adocker-mysql')
const co = require('co')

/** @lends mysql */
function mysql (name, options = {}) {
  let {
    image = 'mysql:latest',
    rootPassword = 'root',
    varDir = 'var/mysql',
    publish = false,
    network = 'default'
  } = options

  const { run, logs, start, stop, remove, terminal } = adockerMysql(name, {
    image,
    rootPassword,
    varDir,
    publish,
    network
  })

  function task (ctx) {
    return co(function * () {
      let { cwd } = ctx
      return run()
    })
  }

  Object.assign(task, {
    run: (ctx) => run(),
    logs: (ctx) => logs(),
    start: (ctx) => start(),
    stop: (ctx) => stop(),
    remove: (ctx) => remove({ force: true }),
    terminal: (ctx) => terminal()
  })

  return task
}

module.exports = mysql
