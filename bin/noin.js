#! /usr/bin/env node

var program = require('commander');
var ops = require('../lib/operations.js');

var isValidFile = ops.isValidFile;
var removeInlineScripts = ops.removeInlineScripts;
var removeInlineEvents = ops.removeInlineEvents;

program
  .version('0.0.1')
  .usage('<input HTML file>')
  .parse(process.argv);

if (!program.args.length) {
  program.help();
} else {
  var dir = program.args[0];
  if (isValidFile(dir)) {
    //console.log(removeInlineScripts(dir));
    removeInlineEvents(dir);
  } else {
    console.log("Not a valid HTML file");
  }
}
