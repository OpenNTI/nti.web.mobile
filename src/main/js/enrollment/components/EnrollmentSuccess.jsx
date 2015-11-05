import React from 'react';

import Loading from 'common/components/Loading';
import BasePathAware from 'common/mixins/BasePath';

import LibraryAccessor from 'library/mixins/LibraryAccessor';


export default React.createClass({
	displayName: 'EnrollmentSuccess',
	//The LibraryAccessor mixin gives us the 'getLibrary' method.
	mixins: [BasePathAware, LibraryAccessor],

	propTypes: {
		courseTitle: React.PropTypes.string
	},

	render () {
		const {props: {courseTitle}, state: {loading}} = this;

		const verbiage = 'Go to my courses';
		const href = this.getBasePath() + 'library/courses/';
		const library = this.getLibrary();

		//If the library is loading, or reloading this will be true.
		if (loading) {
			return ( <Loading/> );
		}

		//We DEPEND on the library being reloaded by the enrollment proccess.
		//If the library has not be triggered to reload by the time this
		//component is mounted/rendered, then the getLastEnrolledCourse will
		//return the WRONG value.

		const {VendorThankYouPage: {thankYouURL} = {}} = library.getLastEnrolledCourse();

		return (
			<div className="enrollment-success">
				<figure className="notice">
					<div>You are enrolled{courseTitle ? ' in ' + courseTitle : ''}.</div>
				</figure>

				{!thankYouURL ? null : (<iframe src={thankYouURL} className="thankyou" frameBorder="0"/>)}

				<a className="button tiny" href={href}>{verbiage}</a>
			</div>
		);
	}
});
