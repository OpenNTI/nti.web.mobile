import path from 'path';
import React from 'react';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

import NavigatableMixin from 'common/mixins/NavigatableMixin';
import ResourceLoaded from 'analytics/mixins/ResourceLoaded';

/**
 * This is not to be confused with Forum topics.
 * The "Topic" here references the <topic> tag in the legacy ToC xml.
 * This is is just a flat link to content.
 */

export default React.createClass({
	displayName: 'CourseOverviewTopic',
	mixins: [NavigatableMixin, ResourceLoaded],

	statics: {
		mimeTest: /topic$/i,
		handles (item) {
			return this.mimeTest.test(item.MimeType);
		}
	},


	render () {
		let {props} = this;
		let {item} = props;

		let link = path.join('content', encodeForURI(item.NTIID)) + '/';

		link = this.makeHref(link, true);

		return (
			<div>
				<a href={link}>{item.label}</a>
			</div>
		);
	}
});
