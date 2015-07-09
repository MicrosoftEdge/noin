var operations = require('./lib/operations');
var noin = require('./bin/noin');

module.exports = {
  runNoin: noin.runNoin,
  getContent: operations.getContent,
  backupOriginal: operations.backupOriginal,
  removeInlineScripts: operations.removeInlineScripts,
  removeInlineEvents: operations.removeInlineEvents,
  getEventListeners: require('./lib/utils.js').getEventListeners

}
