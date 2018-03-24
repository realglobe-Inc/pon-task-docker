/**
 * Pon task for docker
 * @module pon-task-docker
 * @version 3.0.3
 */

'use strict'

const define = require('./define')

let lib = define.bind(this)

Object.assign(lib, define, {
  define
})

module.exports = lib
