var JS = 'script:not([type]), script[type="text/javascript"]';

module.exports = {
  JS_INLINE: JS.split(',').map(function(s) { return s + ':not([src])'; }).join(','),
  EVT_INLINE: /^on/i
};
