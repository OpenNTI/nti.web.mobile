import React from 'react';

import Loading from 'common/components/Loading';

import CourseContentLink from 'library/components/CourseContentLinkMixin';

import EnrollmentOptions from '../mixins/EnrollmentMixin';
import EnrollmentSuccess from './EnrollmentSuccess';

export default React.createClass({
	displayName: 'Enroll',
	mixins: [EnrollmentOptions, CourseContentLink],

	getCourseTitle () {
		return this.getEntry().Title;
	},

	render () {

		if (!this.state.enrollmentStatusLoaded) {
			return <Loading />;
		}

		if(this.state.enrolled) {

			let title = this.getCourseTitle();
			let href = this.courseHref(this.getCourseId());

			return <EnrollmentSuccess href={href} courseTitle={title}/>;
		}

		let widgets = this.enrollmentWidgets();

		return (
			<div>
				{widgets}
			</div>
		);
	}

});
