import {PropTypes} from 'react';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';
import ItemChanges from 'common/mixins/ItemChanges';

const getAssignmentID = props => props.assignmentId
	|| ((!props.assignment || typeof props.assignment === 'string') ? props.assignment : props.assignment.getID())
	|| decodeFromURI(props.rootId);


export default {
	mixins: [ItemChanges],

	propTypes: {
		assignments: PropTypes.object.isRequired,

		//At least one of these props must be given:
		assignment: PropTypes.object,
		assignmentId: PropTypes.string,

		rootId: PropTypes.string //uri-encoded assignmentId
	},


	getItem (props = this.props) {
		const id = getAssignmentID(props);
		return id && props.assignments.getAssignmentSummary(id);
	},


	getAssignment (props = this.props) {
		const {assignment, assignments} = props;
		return assignment || assignments.getAssignment(getAssignmentID(props));
	},


	getStore () {
		return this.getItem();
	}
};
