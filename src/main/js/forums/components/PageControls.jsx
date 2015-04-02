import React from 'react';
import {Link} from 'react-router-component';

export default React.createClass({
	displayName: 'PageControls',

	propTypes: {
		// available from Paging mixin
		paging: React.PropTypes.shape({
			currentPage: React.PropTypes.number,
			pageSize: React.PropTypes.number,
			hasPrevious: React.PropTypes.bool,
			hasNext: React.PropTypes.bool
		}).isRequired
	},

	render () {

		let {paging} = this.props;
		let next = paging.currentPage() + 1;
		let prev = paging.currentPage() - 1;

		return (
			<div className="page-controls">
				<Link href={'/?p=' + prev}>Previous ({prev})</Link>
				<Link href={'/?p=' + next}>Next ({next})</Link>
			</div>
		);
	}
});
