var fs = require('fs');
var path = require('path');
var whacko = require('whacko');
var utils = require('./utils.js');
var constants = require('./constants.js');

var searchAll = utils.searchAll;
var getTextContent = utils.getTextContent;

module.exports = {
  isValidFile: function(dir) {
    if (!fs.existsSync(dir) || !fs.lstatSync(dir).isFile() || path.extname(dir) !== '.html') {
      return false;
    }
    return true;
  },

  removeInlineScripts: function(dir) {
    var filename = dir;
    var noext = filename.replace(/\.[^/.]+$/, "");

    var content = fs.readFileSync(dir, 'utf8');
    content = content.replace(/^\uFEFF/, '');

    var $ = whacko.load(content);

    var idx = 0;
    searchAll($, constants.JS_INLINE).each(function() {
      var el = $(this);
      var content = getTextContent(el);
      var scriptName = noext + '_script' + idx + '.js';
      fs.writeFileSync(scriptName, content);
      el.replaceWith($('<script src="' + scriptName + '"></script>'));
      idx++;
    });

    fs.writeFileSync(filename, $.html());
    fs.writeFileSync(filename + '.old', content);

    return 'Complete!';
  },

  removeInlineEvents: function(dir) {
    var content = fs.readFileSync(dir, 'utf8');
    content = content.replace(/^\uFEFF/, '');

    var $ = whacko.load(content);
    var listeners = {};
    var idx = 0;
    searchAll($, constants.EVT_INLINE).each(function() {
      var el = $(this);
      var content = el.attr('onclick');
      var id;
      if (el.attr('id')) {
        id = el.attr('id');
      } else {
        id = 'listener_' + idx;
        el.attr('id', id);
        idx++;
      }
      listeners[id] = content;
      el.attr('onclick', null);
    });

    var script = [];
    for (var id in listeners) {
      var getElString = 'var ' + id + ' = document.getElementById("' + id + '");';
      var evtListener = id + '.addEventListener("click", function() {' + listeners[id] + '}, false);';
      script.push(getElString);
      script.push(evtListener);
    }

    console.log(script);


  }

};
