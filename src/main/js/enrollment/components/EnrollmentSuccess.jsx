import React from 'react';

import BasePathAware from 'common/mixins/BasePath';

export default React.createClass({
	displayName: 'EnrollmentSuccess',
	mixins: [BasePathAware],

	propTypes: {
		courseTitle: React.PropTypes.string,
		href: React.PropTypes.string
	},

	render () {
		let basePath = this.getBasePath();
		let {courseTitle, href} = this.props;
		let verbage = 'Go to the course';

		if (!href) {
			href = basePath + 'library/';
			verbage = 'Go to my courses';
		}

		return (
			<div className="enrollment-success">
				<figure className="notice">
					<div>You are enrolled in {courseTitle}.</div>
				</figure>


				<a className="button tiny" href={href}>{verbage}</a>
			</div>
		);
	}
});
