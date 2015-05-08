import React from 'react';

import path from 'path';

import Loading from 'common/components/Loading';

import ContextSender from 'common/mixins/ContextSender';

import EnrollmentOptions from '../mixins/EnrollmentMixin';
import EnrollmentSuccess from './EnrollmentSuccess';

export default React.createClass({
	displayName: 'Enroll',
	mixins: [EnrollmentOptions, ContextSender],

	getCourseTitle () {
		let e = this.getEntry();
		return e ? e.Title : 'Unknown';
	},


	getContext () {
		return Promise.resolve([
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
			return <EnrollmentSuccess courseTitle={this.getCourseTitle()}/>;
		}

		let thumb = (this.getEntry() || {}).thumb;
		let title = this.getCourseTitle();

		return (
			<div className="enrollment-options">
				{thumb && (
					<div className="course-banner">
						<img src={thumb} />
						<label>
							<h3>{title}</h3>
						</label>
					</div>
				)}
				{this.enrollmentWidgets()}
			</div>
		);
	}

});
