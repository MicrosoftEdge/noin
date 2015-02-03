#! /usr/bin/env node

var program = require('commander');
var ops = require('../lib/operations.js');

var removeIndents = ops.removeIndents;

program
  .version('0.0.1')
  .usage('<input HTML file>')
  .parse(process.argv);

if (!program.args.length) {
  program.help();
} else {
  console.log(removeIndents(program.args[0]));
}
