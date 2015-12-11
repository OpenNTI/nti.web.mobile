import React from 'react';

import FilterSearchBar from './FilterSearchBar';

export default React.createClass({
	displayName: 'Performance',

	propTypes: {
		assignments: React.PropTypes.object.isRequired
	},

	render () {

		const {assignments} = this.props;

		return (
			<div className="performance-view">
				<FilterSearchBar assignments={assignments} />
			</div>
		);
	}
});
