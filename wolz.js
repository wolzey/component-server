#!/usr/bin/env node
require('dotenv').config()
const program = require('commander')

const publish = require('./commands/publish')

program
  .version('0.1.0')
  .command('publish')
  .description('publish directory to component server')
  .action(publish)

program.parse(process.argv)
