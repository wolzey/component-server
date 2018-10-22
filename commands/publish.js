const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')
const ComponentPublisher = require('../helpers/Publisher')

module.exports = (command)  => {
  const currentDirectory = process.cwd()
  const pathToConfig = path.join(currentDirectory, 'wolz.yml')
  const config = yaml.safeLoad(fs.readFileSync(pathToConfig, 'utf8'))
  const Publisher = new ComponentPublisher(config)

  Publisher.publish()
}
