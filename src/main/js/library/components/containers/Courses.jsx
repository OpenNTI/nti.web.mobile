import React from 'react';

import Container from './Container';

export default React.createClass({
	displayName: 'Courses',

	propTypes: {
		admin: React.PropTypes.bool
	},

	render () {
		const {props: {admin}} = this;

		let section = admin ? 'admin' : 'courses';

		return (
			<Container section={section} items={[]}/>
		);
	}
});
