/**
 * Define task
 * @function define
 * @param {Object} [options={}] - Optional settings
 * @returns {function} Defined task
 */
'use strict'

const mysql = require('./mysql')

const subPacks = { mysql }

/** @lends define */
function define (options = {}) {
  let subTasks = Object
    .keys(subPacks)
    .reduce((subTasks, name) => Object.assign(subTasks, {
      [name]: subPacks[ name ](...(options[ name ] || []))
    }), {})

  function task (ctx) {
    return Promise.all([
      Object.keys(subTasks).map((name) => subTasks[ name ](ctx))
    ])
  }

  return Object.assign(task, subTasks)
}

module.exports = Object.assign(define, subPacks)
