var fs = require('fs');
var path = require('path');
var whacko = require('whacko');
var beautify_js = require('js-beautify');
var beautify_html = require('js-beautify').html;

var utils = require('./utils.js');
var constants = require('./constants.js');

var getTextContent = utils.getTextContent;
var getDefaultScriptLoc = utils.getDefaultScriptLoc;
var getEventListeners = utils.getEventListeners;

module.exports = {
  isValidFile: function(dir) {
    if (!fs.existsSync(dir) || !fs.lstatSync(dir).isFile() || path.extname(dir) !== '.html') {
      return false;
    }
    return true;
  },
  isValidDir: function(dir) {
    if (!fs.existsSync(dir) || !fs.lstatSync(dir).isDirectory()) {
      return false;
    }
    return true;
  },
  getContent: function(dir) {
    var content = fs.readFileSync(dir, 'utf8');
    content = content.replace(/^\uFEFF/, '');
    return {dir: dir, content: content};
  },
  backupOriginal: function(dir, content) {
    fs.writeFileSync(dir + '.old', content);
  },
  writeHTML: function(dir, content) {
    fs.writeFileSync(dir, beautify_html(content));
  },
  removeInlineScripts: function(dir, content) {
    var noext = dir.replace(/\.[^/.]+$/, "");

    var $ = whacko.load(content);

    var idx = 0;

    $(constants.JS_INLINE).each(function() {
      var el = $(this);
      var content = getTextContent(el);
      var scriptName = noext + '_script' + idx + '.js';
      fs.writeFileSync(scriptName, beautify_js(content));
      el.replaceWith($('<script src="' + scriptName + '"></script>'));
      idx++;
    });
    return $.html();
  },
  removeInlineEvents: function(dir, content) {
    var noext = dir.replace(/\.[^/.]+$/, "");

    var $ = whacko.load(content);
    var listeners = {};
    var idx = 0;
    var listenerstest = {};
    $('body').find('*').each(function() {
      var el = $(this);
      var eventListeners = getEventListeners(el);
      eventListeners.forEach(function(eventListener) {
        var content = el.attr(eventListener);
        var id;
        if (el.attr('id')) {
          id = el.attr('id');
        } else {
          id = 'listener_' + idx;
          el.attr('id', id);
          idx++;
        }
        if (!listeners[id]) {
          var obj = {};
          obj[eventListener] = content;
          listeners[id] = obj;
        } else {
          listeners[id][eventListener] = content;
        }
        el.attr(eventListener, null);
      });
    });
      var script = [];
      for (var id in listeners) {
        var getElString = 'var ' + id + ' = document.getElementById("' + id + '");';
        script.push(getElString);
        for (var listener in listeners[id]) {
          var evtListener = id + '.addEventListener( "' + listener.substr(2) + '", function() {' + listeners[id][listener] + '}, false);';
          script.push(evtListener);
        }
      }

    var scriptName = noext + '_events.js';
    fs.writeFileSync(scriptName, beautify_js(script.join('\n')));
    getDefaultScriptLoc($).append('<script src="' + scriptName + '"></script>');

    return $.html();
  },
};
