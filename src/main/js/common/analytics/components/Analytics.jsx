/**
 * @jsx React.DOM
 */

'use strict'

var React = require('react/addons');
var Store = require('../Store');

var Analytics = React.createClass({

	componentDidMount: function() {
		Store.init();
	},

	render: function() {
		return null;
	}

});

module.exports = Analytics;
