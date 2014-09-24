/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var constants = require('../constants/DataURIs');
var urlJoin = require('dataserverinterface/utils/urljoin');
var moment = require('moment')

module.exports = React.createClass({
	displayName: 'Avatar',

	getDefaultProps: function() {
		return {
			format: "default",
			created: null
		};
	},

	getInitialState: function() {
		return {
			format: this.props.format,
			created: this.props.created
		};
	},

	format: function(time) {
		if (this.state.format == 'default') {
			return time.format("MMM Do YYYY, h:mm:ss a")
		}
	},

	render: function() {
		var time = moment();
		if (this.state.created){
			time = moment(this.state.created * 1000)
		}
		return(<time className='time' datetime={time.format()}>{this.format(time)}</time>);
	}
});
