import './NotEnrolled.scss';
import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { Enrollment } from '@nti/web-course';
import { Mixins } from '@nti/web-commons';
import { getHistory } from '@nti/web-routing';
import { encodeForURI } from '@nti/lib-ntiids';

import Mixin from './mixin';

export default createReactClass({
	displayName: 'NotEnrolled',

	mixins: [Mixins.BasePath, Mixin],

	propTypes: {
		catalogEntry: PropTypes.object.isRequired,
	},

	childContextTypes: {
		router: PropTypes.object,
	},

	getChildContext() {
		return {
			router: {
				...(this.context.router || {}),
				baseroute: '/mobile',
				getRouteFor: this.getRouteFor,
				history: getHistory(),
			},
		};
	},

	getRouteFor(object, context) {
		const isEnrolled =
			object.MimeType ===
			'application/vnd.nextthought.courseware.courseinstanceenrollment';
		const isAdmin =
			object.MimeType ===
			'application/vnd.nextthought.courseware.courseinstanceadministrativerole';

		if ((isEnrolled || isAdmin) && context === 'open') {
			return `/mobile/course/${encodeForURI(
				object.getCourseID ? object.getCourseID() : object.NTIID
			)}/`;
		}
	},

	hasOptions(catalogEntry) {
		function available(option) {
			return (option || {}).available;
		}
		return (
			catalogEntry &&
			Object.values(catalogEntry.getEnrollmentOptions().Items).some(
				available
			)
		);
	},

	render() {
		const { catalogEntry } = this.props;
		const hasOptions = this.hasOptions(catalogEntry);
		const href = this.enrollmentHref(this.getBasePath(), catalogEntry);

		return (
			<div className="enrollment-status-none">
				{!hasOptions && (
					<Enrollment.Options catalogEntry={catalogEntry} />
				)}
				{hasOptions && (
					<a className="button" href={href}>
						CONTINUE TO ENROLLMENT
					</a>
				)}
			</div>
		);
	},
});
