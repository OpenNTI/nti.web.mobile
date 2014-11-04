/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var EnrollmentStore = require('../../enrollment').Store;
var Actions = require('../Actions');

function _flush(event) {
	console.log('InvalidationListener: reloading library in response to event: %O', event);
	Actions.reload();
}

var InvalidationListener = React.createClass({

	componentDidMount: function() {
		EnrollmentStore.addChangeListener(_flush);
	},

	componentWillUnmount: function() {
		EnrollmentStore.removeChangeListener(_flush);	
	},

	render: function() {
		return null;
	}

});

module.exports = InvalidationListener;