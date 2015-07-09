#! /usr/bin/env node

var program = require('commander');
var glob = require('glob');
var ops = require('../lib/operations.js');

var isValidFile = ops.isValidFile;
var isValidDir = ops.isValidDir;
var removeInlineScripts = ops.removeInlineScripts;
var removeInlineEvents = ops.removeInlineEvents;
var getContent = ops.getContent;
var writeHTML = ops.writeHTML;
var backupOriginal = ops.backupOriginal;

function  main() {
  program
    .version('0.0.1')
    .usage('<input HTML file>')
    .option('-r, --recurse', 'Recursively run noin on folder')
    .option('-b, --backup', 'Create a backup')
    .option('-v, --verbose', 'Print debug info')
    .parse(process.argv);

  if (!program.args.length) {
    program.help();
  } else {
    var dir = program.args[0];
    if (program.recurse) {
      if (isValidDir) {
        glob('**/*.html', {nodir: true, nocase: true}, function(err, files) {
          files.forEach(function(file) {
            runNoin(file)
          });
          console.log("All Files Complete!");
        });
      } else {
        console.log("Not a Directory");
      }
    } else {
      runNoin(dir);
    }
  }
}

function runNoin(dir) {
  if (isValidFile(dir)) {
    var html = getContent(dir);
    if (program.backup) {
      if (program.verbose) {
        console.log('backing up original file to ' + dir + '.old');
      }
      backupOriginal(html.dir, html.content);
    }
    html.content = removeInlineEvents(html.dir, html.content);
    html.content = removeInlineScripts(html.dir, html.content);
    writeHTML(html.dir, html.content);
    if (program.verbose) {
      console.log(dir + ' completed!');
    }
  } else {
    console.log("Not a valid HTML file");
  }

}

if (!module.parent) {
  main();
} else {
  module.exports = {runNoin: runNoin};
}
