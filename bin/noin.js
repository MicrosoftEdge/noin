#! /usr/bin/env node

var program = require('commander');
var ops = require('../lib/operations.js');

var isValidFile = ops.isValidFile;
var removeInlineScripts = ops.removeInlineScripts;
var removeInlineEvents = ops.removeInlineEvents;
var getContent = ops.getContent;
var writeHTML = ops.writeHTML;
var backupOriginal = ops.backupOriginal;

program
  .version('0.0.1')
  .usage('<input HTML file>')
  .parse(process.argv);

if (!program.args.length) {
  program.help();
} else {
  var dir = program.args[0];
  if (isValidFile(dir)) {
    var html = getContent(dir);
    backupOriginal(html.dir, html.content);
    html.content = removeInlineEvents(html.dir, html.content);
    html.content = removeInlineScripts(html.dir, html.content);
    writeHTML(html.dir, html.content);
    console.log("Complete!");
  } else {
    console.log("Not a valid HTML file");
  }
}
