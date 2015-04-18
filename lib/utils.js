var path = require('path');

module.exports = {
  searchAll: function($, query) {
    return $(query);
  },
  getTextContent: function(node) {
    var unwrapped = node.cheerio ? node.get(0) : node;
    var child = unwrapped.children[0];
    return child ? child.data : '';
  },
  getDefaultScriptLoc: function($) {
    var pos = $('body').last();
    if (!pos.length) {
      pos = $.root();
    }
    return pos;
  }
};
