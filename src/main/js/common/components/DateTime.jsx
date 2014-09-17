/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var moment = require('moment');

var isRelative = /relative/i;

module.exports = React.createClass({
	displayName: 'DateTime',

	propTypes: {
		date: React.PropTypes.any.isRequired,
		format: React.PropTypes.string
	},

	getDefaultProps: function() {
		return {
			date: new Date(),
			format: 'LL'
		};
	},


	render: function() {
		var m = moment(this.props.date);
		var format = this.props.format;
		var text = isRelative.test(format) ? m.fromNow() : m.format(format);
		var props = {
			dateTime: m.format()
		};

		return this.transferPropsTo(React.DOM.time(props, text));
	}
});
