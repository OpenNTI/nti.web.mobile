'use strict';
/*
	MimeType: "application/vnd.nextthought.ntitimeline"
	NTIID: "tag:nexttho....timeline.heading_west"
	desc: "An overview of key dates and events"
	href: "resources...9b.json"
	icon: "resources...3e.png"
	label: "Heading West"
	suggested-inline: false
	visibility: "everyone"
*/

var React = require('react/addons');

var Card = require('common/components/Card');


module.exports = React.createClass({
	displayName: 'CourseOverviewTimeline',

	statics: {
		mimeTest: /ntitimeline/i,
		handles (item) {
			return this.mimeTest.test(item.MimeType);
		}
	},


	prefixJSONWithEmbedURL (url) {
		var source = encodeURI(url);
		// /app/resources/lib/timeline/embed/index.html?source=
		return '/app/resources/lib/timeline/embed/index.html?source=' + source;
	},


	render () {
		var {course, item} = this.props;

		var props = Object.assign({}, this.props, {
			slug: 'timeline',
			contentPackage: course,
			internalOverride: true,
			resolveUrlHook: this.prefixJSONWithEmbedURL
		});

		//map fields for the card
		item.title = item.label;

		return (<Card {...props}/>);
	}
});
