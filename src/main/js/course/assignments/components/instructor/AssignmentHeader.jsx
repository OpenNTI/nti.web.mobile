import React from 'react';

import {setFilter} from '../../GradebookActions';

export default React.createClass({
	displayName: 'instructor:AssignmentHeader',

	setFilter (value) {
		setFilter(value);
	},

	render () {
		return (
			<ul>
				<li onClick={this.setFilter.bind(this, 'Open')}>Open</li>
				<li onClick={this.setFilter.bind(this, 'ForCredit')}>Enrolled</li>
			</ul>
		);
	}
});
