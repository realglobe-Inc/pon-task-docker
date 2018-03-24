'use strict'

const pon = require('pon')
const ponTaskDocker = require('pon-task-docker')

async function tryExample () {
  const run = pon({
    myTask01: ponTaskDocker('my-docker-container-name', {
      image: 'my-docker-image-name:latest',
    })
  })

  run('myTask01')
}

tryExample()
