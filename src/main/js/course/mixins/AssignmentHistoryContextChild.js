import PropTypes from 'prop-types';

export default {
	contextTypes: {
		assignmentsHistory: PropTypes.object,
	},

	getAssignmentHistoryItem(id) {
		let {
			context: { assignmentsHistory: h },
		} = this;
		return h && h.getItem(id);
	},
};
