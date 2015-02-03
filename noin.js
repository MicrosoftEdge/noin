#! /usr/bin/env node

var program = require('commander');
var fs = require('fs');
var path = require('path');
var whacko = require('whacko');

var JS = 'script:not([type]), script[type="text/javascript"]';
var JS_INLINE = JS.split(',').map(function(s) { return s + ':not([src])'; }).join(',');

function concatTemplates($, context, query, matches) {
  $('template, ' + query, context).each(function() {
    if (this.name === 'template') {
      concatTemplates($, this.children[0], query, matches);
    } else {
      matches.push(this);
    }
  });
}

function searchAll($, query) {
  var matches = [];
  concatTemplates($, null, query, matches);
  return $(matches);
}

function getTextContent (node) {
  var unwrapped = node.cheerio ? node.get(0) : node;
  var child = unwrapped.children[0];
  return child ? child.data : '';
}

program
  .version('0.0.1')
  .usage('<input HTML file>')
  .parse(process.argv);

if (!program.args.length) {
  program.help();
} else {
  removeIndents(program.args[0]);
  console.log("Done!");
}

function removeIndents(dir) {
  if (!fs.existsSync(dir) || !fs.lstatSync(dir).isFile() || path.extname(dir) !== '.html') {
    return 'not an HTML file';
  }

  var filename = dir;
  var noext = filename.replace(/\.[^/.]+$/, "");

  var content = fs.readFileSync(dir, 'utf8');
  content = content.replace(/^\uFEFF/, '');

  var $ = whacko.load(content);

  var idx = 0;
  searchAll($, JS_INLINE).each(function() {
    var el = $(this);
    var content = getTextContent(el);
    var scriptName = noext + '_script' + idx + '.js';
    fs.writeFileSync(scriptName, content);
    el.replaceWith($('<script src="' + scriptName + '"></script>'));
    idx++;
  });

  fs.writeFileSync(filename, $.html());
  fs.writeFileSync(filename + '.old', content);

  return;
}
