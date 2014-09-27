/** @jsx React.DOM */
'use strict';

var Card = require('common/components/Card');

var path = require('path');

module.exports = React.createClass({
	displayName: 'NTICard',

	statics: {
		mimeTest: /^application\/vnd\.nextthought\.relatedworkref/i,
		handles: function(item) {
			debugger;
			return this.mimeTest.test(item.MimeType);
		}
	},


	render: function() {

		var props = this.props;
		var basePath = path.join(
			props.basePath,
			'course', //encodeURIComponent(props.course.getID()),
			'o', props.outlineId
		)

		return this.transferPropsTo(<Card
			basePath={basePath} pathname="c"
			package={this.props.course}/>);
	}
});
