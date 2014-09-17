/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'CourseOverviewGroup',

	statics: {
		mimeTest: /^application\/vnd\.nextthought\.nticourseoverviewgroup/i,
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
			<fieldset>
				<legend style={style}>{item.title}</legend>
				{this.props.children}
			</fieldset>
		);
	}
});
