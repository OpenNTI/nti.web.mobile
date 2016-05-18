import React from 'react';
import Detail from 'catalog/components/Detail';
import InviteButton from 'invitations/components/InviteButton';
import EnrollmentStatus from 'enrollment/components/EnrollmentStatus';
import GiftOptions from 'enrollment/components/enrollment-option-widgets/GiftOptions';
import ContextSender from 'common/mixins/ContextSender';

export default React.createClass({
	displayName: 'CourseInfo',
	mixins: [ContextSender],

	propTypes: {
		course: React.PropTypes.object.isRequired
	},

	getContext () {
		return Promise.resolve([{}]);
	},

	render () {
		let {course} = this.props;
		let entry = course && course.CatalogEntry;
		let isAdmin = course && course.isAdministrative;

		return (
			<div className="course-info">
				<Detail {...this.props} entry={entry}/>
				{!isAdmin && <EnrollmentStatus catalogEntry={entry} />}
				{!isAdmin && <GiftOptions catalogEntry={entry} />}
				<InviteButton course={course} />
			</div>
		);
	}
});
