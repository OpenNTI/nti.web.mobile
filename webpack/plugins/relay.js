/*eslint no-var: 0 strict: 0*/
var getbabelRelayPlugin = require('babel-relay-plugin');

var schema = require('../../data/schema.json');

exports = module.exports = getbabelRelayPlugin(schema.data);
