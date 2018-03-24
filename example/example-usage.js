'use strict'

const pon = require('pon')
const ponTaskDocker = require('pon-task-docker')

async function tryExample () {
  const run = pon({
    myTask01: ponTaskDocker({
      image: 'my-docker-image-name:latest',
      name: 'my-docker-container-name'
    })
  })

  run('myTask01')
}

tryExample()
