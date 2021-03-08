import './CourseInfo.scss';
import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import Detail from 'internal/catalog/components/Detail';
import InviteButton from 'internal/invitations/components/InviteButton';
import EnrollmentStatus from 'internal/enrollment/components/EnrollmentStatus';
import GiftOptions from 'internal/enrollment/components/enrollment-option-widgets/GiftOptions';
import ContextSender from 'internal/common/mixins/ContextSender';

export default createReactClass({
	displayName: 'CourseInfo',
	mixins: [ContextSender],

	propTypes: {
		course: PropTypes.object.isRequired,
	},

	getContext() {
		return Promise.resolve([{}]);
	},

	render() {
		let { course } = this.props;
		let entry = course && course.CatalogEntry;
		let isAdmin = course && course.isAdministrative;

		return (
			<div className="course-info">
				<Detail {...this.props} entry={entry} />
				{!isAdmin && (
					<EnrollmentStatus catalogEntry={entry} hideIfNotEnrolled />
				)}
				{!isAdmin && <GiftOptions catalogEntry={entry} />}
				<InviteButton course={course} />
			</div>
		);
	},
});
