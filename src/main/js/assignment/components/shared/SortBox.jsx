import React from 'react';
import {SelectBox} from 'nti-web-commons';

import AssignmentsAccessor from '../../mixins/AssignmentCollectionAccessor';

export default React.createClass({
	displayName: 'SortBox',
	mixins: [AssignmentsAccessor],

	propTypes: {
		value: React.PropTypes.any,
		onChange: React.PropTypes.func.isRequired
	},

	componentWillMount () {
		const {ORDER_BY_COMPLETION, ORDER_BY_DUE_DATE, ORDER_BY_LESSON} = this.getAssignments();

		const sortOptions = [
			{ label: 'By Due Date', value: ORDER_BY_DUE_DATE},
			{ label: 'By Lesson', value: ORDER_BY_LESSON},
			{ label: 'By Completion', value: ORDER_BY_COMPLETION}
		];

		this.setState({sortOptions, sortBy: this.props.value || ORDER_BY_LESSON});
	},

	componentWillReceiveProps (nextProps) {
		if (nextProps.value) {
			this.setState({sortBy: nextProps.value});
		}
	},

	render () {

		let {sortOptions, sortBy} = this.state;

		return (
			<SelectBox options={sortOptions} onChange={this.props.onChange} value={sortBy} />
		);
	}
});
