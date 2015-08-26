import React from 'react';

import SelectionModel from '../utils/ListSelectionModel';

export default React.createClass({
	displayName: 'UserSearch',

	propTypes: {
		search: React.PropTypes.string,
		selection: React.PropTypes.instanceOf(SelectionModel)
	},

	render () {
		return (
			<div />
		);
	}
});
