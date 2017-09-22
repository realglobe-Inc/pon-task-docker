'use strict'

const pon = require('pon')
const ponTaskDocker = require('pon-task-docker')

async function tryExample () {
  const run = pon({
    myTask01: ponTaskDocker()
  })

  run('myTask01')
}

tryExample()
