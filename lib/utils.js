var path = require('path');

function concatTemplates($, context, query, matches) {
  $('template, ' + query, context).each(function() {
    if (this.name === 'template') {
      concatTemplates($, this.children[0], query, matches);
    } else {
      matches.push(this);
    }
  });
}

module.exports = {
  searchAll: function($, query) {
    var matches = [];
    concatTemplates($, null, query, matches);
    return $(matches);
  },
  getTextContent: function(node) {
    var unwrapped = node.cheerio ? node.get(0) : node;
    var child = unwrapped.children[0];
    return child ? child.data : '';
  }

};
