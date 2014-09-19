/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Video = require('common/components/Video');

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
			backgroundImage: 'url(' + item.poster + ')',
			backgroundSize: 'cover'
		};
		console.log(item);
		return (
			<li style={style} className="flex-video widescreen">{item.label}</li>
		);
	}
});
