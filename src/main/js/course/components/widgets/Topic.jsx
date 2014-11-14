/** @jsx React.DOM */
'use strict';
var path = require('path');
var React = require('react/addons');
var NTIID = require('dataserverinterface/utils/ntiids');
var NavigatableMixin = require('common/mixins/NavigatableMixin');

module.exports = React.createClass({
	displayName: 'CourseOverviewTopic',
	mixins: [NavigatableMixin],

	statics: {
		mimeTest: /topic$/i,
		handles: function(item) {
			return this.mimeTest.test(item.MimeType);
		}
	},


	render: function() {
		var props = this.props;
		var item = props.item;

		var link = path.join('c', NTIID.encodeForURI(item.NTIID)) + '/';

		link = this.makeHref(link, true);

		return (
			<div>
				<a href={link}>{item.label}</a>
			</div>
		);
	}
});
