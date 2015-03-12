import React from 'react';

import path from 'path';

import Loading from 'common/components/Loading';
import CourseContentLink from 'library/components/CourseContentLinkMixin';

import ContextSender from 'common/mixins/ContextSender';

import EnrollmentOptions from '../mixins/EnrollmentMixin';
import EnrollmentSuccess from './EnrollmentSuccess';

export default React.createClass({
	displayName: 'Enroll',
	mixins: [EnrollmentOptions, CourseContentLink, ContextSender],

	getCourseTitle () {
		return this.getEntry().Title;
	},


	getContext () {
		return Promise.resolve([
			{
				label: this.getCourseTitle(),
				href: path.normalize(this.makeHref('..'))
			},
			{
				label: 'Enroll',
				href: path.normalize(this.makeHref(this.getPath()))
			}
		]);
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
