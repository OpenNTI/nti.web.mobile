import React from 'react';

import BasePathAware from 'common/mixins/BasePath';

export default React.createClass({
	displayName: 'EnrollmentSuccess',
	mixins: [BasePathAware],

	propTypes: {
		courseTitle: React.PropTypes.string
	},

	render () {
		let basePath = this.getBasePath();
		let {courseTitle} = this.props;
		let verbiage = 'Go to my courses';
		let href = basePath + 'library/courses/';

		console.log(this.props);
		const thankYouURL = null;

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
