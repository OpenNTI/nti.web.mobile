import React from 'react';

import Loading from 'common/components/Loading';
import BasePathAware from 'common/mixins/BasePath';

import LibraryAccessor from 'library/mixins/LibraryAccessor';

import ThankYou from './ThankYou';

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

		//If the library is loading, or reloading this will be true.
		if (loading) {
			return ( <Loading/> );
		}

		return (
			<div className="enrollment-success">
				<figure className="notice">
					<div>You are enrolled{courseTitle ? ' in ' + courseTitle : ''}.</div>
				</figure>

				<ThankYou/>

				<a className="button tiny" href={href}>{verbiage}</a>
			</div>
		);
	}
});
