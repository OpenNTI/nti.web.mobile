import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {Mixins} from '@nti/web-commons';

import Mixin from './mixin';

export default createReactClass({
	displayName: 'EnrolledOpen',

	mixins: [Mixins.BasePath, Mixin],

	propTypes: {
		catalogEntry: PropTypes.object.isRequired
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
