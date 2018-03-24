/**
 * @function network
 * @param {string}
 */
'use strict'

const adocker = require('adocker')

/** @lends network */
function network (name) {
  async function task (ctx) {
    return await task.run(ctx)
  }

  const has = async () => {
    const [info] = await adocker.inspect(name)
    return !!info
  }

  Object.assign(task, {
    async run (ctx) {
      const skip = !!(await has())
      if (skip) {
        return
      }
      await adocker.network.create(name)
    },
    async remove (ctx) {
      const skip = !(await has())
      if (skip) {
        return
      }
      await adocker.network.remove(name)
    }
  })

  return task
}

module.exports = network
