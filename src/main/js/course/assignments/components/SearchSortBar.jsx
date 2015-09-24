import React from 'react';
import SortBox from './SortBox';

export default React.createClass({
	displayName: 'SearchSortBar',

	propTypes: {
		assignments: React.PropTypes.object.isRequired,
		onSortChange: React.PropTypes.func,
		onSearchChange: React.PropTypes.func
	},

	render () {

		let {assignments, onSortChange, onSearchChange} = this.props;

		return (
			<div className="search-sort-bar">
				<SortBox assignments={assignments} onChange={onSortChange} />
				<input className="search" type="search" placeholder="Search Assignments" onChange={onSearchChange} />
			</div>
		);
	}
});
