var fs = require('fs');
var path = require('path');
var whacko = require('whacko');
var utils = require('./utils.js');
var constants = require('./constants.js');

var searchAll = utils.searchAll;
var getTextContent = utils.getTextContent;

module.exports = {
  removeIndents: function(dir) {
    if (!fs.existsSync(dir) || !fs.lstatSync(dir).isFile() || path.extname(dir) !== '.html') {
      return 'not an HTML file';
    }

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
  }

};
