module.exports = async function (globalConfig, projectConfig) {
  console.log('global setup')
  // console.log(globalConfig.testPathPattern)
  // console.log(projectConfig.cache)

  // Set reference to mongod in order to close the server during teardown.
  // globalThis.__MONGOD__ = mongod
  globalThis.dude = '245'
}
