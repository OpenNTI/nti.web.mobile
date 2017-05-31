import PropTypes from 'prop-types';
import React from 'react';

export default {

	contextTypes: {
		assignmentsHistory: PropTypes.object
	},


	getAssignmentHistoryItem (id) {
		let {context: {assignmentsHistory: h}} = this;
		return h && h.getItem(id);
	}
};
