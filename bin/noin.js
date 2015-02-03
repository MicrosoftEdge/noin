#! /usr/bin/env node

var program = require('commander');
var ops = require('../lib/operations.js');

var removeInlineScripts = ops.removeInlineScripts;

program
  .version('0.0.1')
  .usage('<input HTML file>')
  .parse(process.argv);

if (!program.args.length) {
  program.help();
} else {
  console.log(removeInlineScripts(program.args[0]));
}
