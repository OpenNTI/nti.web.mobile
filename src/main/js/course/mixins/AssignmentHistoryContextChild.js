import React from 'react';

export default {

	contextTypes: {
		assignmentsHistory: React.PropTypes.object
	},


	getAssignmentHistoryItem (id) {
		let {context: {assignmentsHistory: h}} = this;
		return h && h.getItem(id);
	}
};
