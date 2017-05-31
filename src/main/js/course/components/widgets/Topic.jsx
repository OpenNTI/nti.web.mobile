import path from 'path';
import React from 'react';

import createReactClass from 'create-react-class';

import {encodeForURI} from 'nti-lib-ntiids';

import {Mixins} from 'nti-web-commons';
import {Mixin as ResourceLoaded} from 'nti-analytics';

/**
 * This is not to be confused with Forum topics.
 * The "Topic" here references the <topic> tag in the legacy ToC xml.
 * This is is just a flat link to content.
 */

export default createReactClass({
	displayName: 'CourseOverviewTopic',
	mixins: [Mixins.NavigatableMixin, ResourceLoaded],

	statics: {
		mimeTest: /topic$/i,
		handles (item) {
			return this.mimeTest.test(item.MimeType);
		}
	},

	propTypes: {
		item: React.PropTypes.object.isRequired
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
