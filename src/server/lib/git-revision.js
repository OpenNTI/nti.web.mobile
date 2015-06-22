/*eslint no-var: 0 strict: 0*/
var git = require('git-rev-sync');

module.exports = 'branch: ' + git.branch() + ' [' + git.short() + ']';
