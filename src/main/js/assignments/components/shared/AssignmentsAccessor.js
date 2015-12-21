import React from 'react';
import ItemChanges from 'common/mixins/ItemChanges';

//AssignmentsAccessor
export default {
	mixins: [ItemChanges],

	propTypes: {
		assignments: React.PropTypes.object.isRequired
	},

	//Ignore this... its for the ItemChanges mixin.
	getItem (props = this.props) {
		const {assignments: a} = props;
		return a && a.getGrouppedStore();
	},

	//This is the public accessor
	getAssignments () {
		return this.getItem();
	}
};
