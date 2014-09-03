'use strict';

var merge = require('react/lib/merge');
var view = require('./components/LibraryView');

var actions = require('./LibraryActions');
var constants = require('./LibraryConstants');
var store = require('./LibraryStore');

module.exports = merge(exports, {

	View: view

});
