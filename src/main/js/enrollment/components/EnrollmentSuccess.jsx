import PropTypes from 'prop-types';
import React from 'react';

import createReactClass from 'create-react-class';

import {Loading, Mixins} from 'nti-web-commons';

import LibraryAccessor from 'library/mixins/LibraryAccessor';

import ThankYou from './ThankYou';

function getLastEnrolledCourseTitle (library) {
	return (library.getLastEnrolledCourse() || {}).title;
}

export default createReactClass({
	displayName: 'EnrollmentSuccess',
	//The LibraryAccessor mixin gives us the 'getLibrary' method.
	mixins: [Mixins.BasePath, LibraryAccessor],

	propTypes: {
		courseTitle: PropTypes.string
	},

	render () {
		const {props: {courseTitle}, state: {loading}} = this;

		const verbiage = 'Go to my courses';
		const href = this.getBasePath() + 'library/courses/';
		const library = this.getLibrary();

		//If the library is loading, or reloading this will be true.
		if (loading || !library) {
			return ( <Loading.Mask /> );
		}

		const label = courseTitle || getLastEnrolledCourseTitle(library);

		return (
			<div className="enrollment-success">
				<figure className="notice">
					<div>You are enrolled{label ? ' in ' + label : ''}.</div>
				</figure>

				<ThankYou/>

				<a className="button tiny" href={href}>{verbiage}</a>
			</div>
		);
	}
});
