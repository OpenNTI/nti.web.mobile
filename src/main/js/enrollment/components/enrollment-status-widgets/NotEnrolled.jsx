import React from 'react';
import PropTypes from 'prop-types';

import { Enrollment } from '@nti/web-course';
import { Button } from '@nti/web-core';
import { getHistory, useBasePath } from '@nti/web-routing';
import { encodeForURI } from '@nti/lib-ntiids';

import { enrollmentHref } from './utils';

const hasOptions = catalogEntry =>
	Object.values(catalogEntry?.getEnrollmentOptions?.()?.Items || []).some(
		option => (option || {}).available
	);

const NoStatus = styled.div`
	padding: 0;
	box-shadow: none;

	:global(.nti-course-enrollment-options .enrollment-container) {
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
	}
`;
export default class NotEnrolled extends React.Component {
	static propTypes = {
		catalogEntry: PropTypes.object.isRequired,
	};

	static childContextTypes = {
		router: PropTypes.object,
	};

	getChildContext() {
		return {
			router: {
				...(this.context.router || {}),
				baseroute: '/mobile',
				getRouteFor: this.getRouteFor,
				history: getHistory(),
			},
		};
	}

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
	}

	render() {
		return <Content {...this.props} />;
	}
}

function Content({ catalogEntry }) {
	const basePath = useBasePath();
	const href = enrollmentHref(basePath, catalogEntry);

	return (
		<NoStatus className="enrollment-status-none">
			{!hasOptions(catalogEntry) ? (
				<Enrollment.Options catalogEntry={catalogEntry} />
			) : (
				<Button
					href={href}
					css={css`
						width: 100%;
					`}
				>
					CONTINUE TO ENROLLMENT
				</Button>
			)}
		</NoStatus>
	);
}
