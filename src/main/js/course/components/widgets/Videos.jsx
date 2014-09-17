/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'CourseOverviewVideos',

	statics: {
		mimeTest: /^application\/vnd\.nextthought\.ntivideoset/i,
		handles: function(item) {
			return this.mimeTest.test(item.MimeType);
		}
	},

	render: function() {

		return (
			<div>
				{this.props.children}
			</div>
		);
	}
});
