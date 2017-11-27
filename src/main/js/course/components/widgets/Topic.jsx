import path from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {encodeForURI} from 'nti-lib-ntiids';
import {Mixins} from 'nti-web-commons';

/**
 * This is not to be confused with Forum topics.
 * The "Topic" here references the <topic> tag in the legacy ToC xml.
 * This is is just a flat link to content.
 */

export default createReactClass({
	displayName: 'CourseOverviewTopic',
	mixins: [Mixins.NavigatableMixin],

	statics: {
		mimeTest: /topic$/i,
		handles (item) {
			return this.mimeTest.test(item.MimeType);
		}
	},

	propTypes: {
		item: PropTypes.object.isRequired
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
