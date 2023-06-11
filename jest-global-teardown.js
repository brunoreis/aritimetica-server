module.exports = async function (globalConfig, projectConfig) {
  console.log('global teardown')
  // console.log(globalConfig.testPathPattern);
  // console.log(projectConfig.cache);

  console.log(globalThis.dude)
}
