/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'CourseOverviewVideo',

	statics: {
		mimeTest: /^application\/vnd\.nextthought\.ntivideo/i,
		handles: function(item) {
			return this.mimeTest.test(item.MimeType);
		}
	},

	render: function() {
		var item = this.props.item;
		var style = {
			backgroundColor: '#' + item.accentColor
		};

		return (
			<div>{item}</div>
		);
	}
});
