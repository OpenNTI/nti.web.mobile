import React from 'react';

import ActionsMenu from '../ActionsMenu';

export default React.createClass({
	displayName: 'GradebookColumnActions',

	statics: {
		label () {
			return '';
		},
		className: 'col-actions',
		sort: ''
	},

	propTypes: {
		item: React.PropTypes.object.isRequired // UserGradeBookSummary object
	},

	render () {

		const {item} = this.props;
		if(!item.HistoryItemSummary || !item.HistoryItemSummary.grade) {
			return null;
		}

		return (
			<ActionsMenu {...this.props} />
		);
	}
});
