import React from 'react';

import BasePath from 'common/mixins/BasePath';

import Mixin from './mixin';

export default React.createClass({
	displayName: 'EnrolledOpen',

	mixins: [BasePath, Mixin],

	propTypes: {
		catalogEntry: React.PropTypes.object.isRequired
	},

	render () {
		const {catalogEntry} = this.props;
		const href = this.enrollmentHref(this.getBasePath(), catalogEntry);
		return (
			<div className="enrollment-status-open">
				<div className="about-open-courses">
					<div className="heading">About Open Courses</div>
					<div className="content">
						Get complete access to interact with all course content including the lectures, course materials, quizzes, and disucssions once class is in session.
					</div>
					<ul>
						<li>Free to anyone, anywhere</li>
						<li className="not-for-credit">Not for credit</li>
					</ul>
				</div>
				<div className="status">
					<span className="registered">You are registered</span>
					<a href={href} className="edit">Edit</a>
				</div>
			</div>
		);
	}
});
