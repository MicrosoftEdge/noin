'use strict';
var constants = require('./constants.js');

module.exports = {
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
  },
  getEventListeners: function(el) {
    var attributes = [];

    for (var attribute in el[0].attribs) {
      if (el[0].attribs.hasOwnProperty(attribute)) {
        var result = constants.EVT_INLINE.exec(attribute);
          if (result && result.length > 0) {
            attributes.push(attribute);
          }
      }
    }
    return attributes;
  }
};
