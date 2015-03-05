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

import React from 'react';

import QueryString from 'query-string';

import Card from 'common/components/Card';


export default React.createClass({
	displayName: 'CourseOverviewTimeline',

	statics: {
		mimeTest: /ntitimeline/i,
		handles (item) {
			return this.mimeTest.test(item.MimeType);
		}
	},


	prefixJSONWithEmbedURL (source) {
		let title = (this.props.item || {}).label;
		let params = QueryString.stringify({title,source});

		params = params.replace(/%2F/ig, '/');//TimelineJS is not correctly decoding the URI params

		// /app/resources/lib/timeline/embed/index.html?source=
		return '/app/resources/lib/timeline/embed/index.html?' + params;
	},


	render () {
		let {course, item} = this.props;

		let props = Object.assign({}, this.props, {
			slug: 'timeline',
			contentPackage: course,
			internalOverride: false,
			resolveUrlHook: this.prefixJSONWithEmbedURL
		});

		//map fields for the card
		item.title = item.label;

		return (<Card {...props}/>);
	}
});
