/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var WidgetsMixin = require('./Mixin');

module.exports = React.createClass({
	displayName: 'CourseOverviewGroup',
	mixins: [WidgetsMixin],

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
			<fieldset className="course-overview-group">
				<legend style={style}>{item.title}</legend>
				{this._renderItems(item.Items)}
			</fieldset>
		);
	}
});
