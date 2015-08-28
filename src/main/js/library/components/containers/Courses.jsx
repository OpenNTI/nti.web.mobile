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
		let courses = this.getBinnedData(section);

		let items = courses.reduce((a, o) => a.concat(o.items), []); //join into one list

		return (
			<Container section={section} items={items}/>
		);
	}
});
