import React from 'react';
import AssignmentsList from './AssignmentsList';
import SelectBox from 'common/components/SelectBox';


export default React.createClass({
	displayName: 'Assignments',

	propTypes: {
		assignments: React.PropTypes.object.isRequired,
		course: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {};
	},

	componentWillMount () {
		const {props: {assignments: {ORDER_BY_COMPLETION, ORDER_BY_DUE_DATE, ORDER_BY_LESSON}}} = this;

		const sortOptions = [
			{ label: 'By Due Date', value: ORDER_BY_DUE_DATE},
			{ label: 'By Lesson', value: ORDER_BY_LESSON},
			{ label: 'By Completion', value: ORDER_BY_COMPLETION}
		];

		this.setState({sortOptions, sortBy: ORDER_BY_DUE_DATE});
	},


	onSortChange (event) {
		this.setState({
			sortby: event.target.value
		});
	},

	render () {
		const {props: {course, assignments}, state: {sortOptions, sortBy}} = this;
		return (
			<div>
				<div className="search-sort-bar">
					<SelectBox options={sortOptions} onChange={this.onSortChange} />
					<input type="search" placeholder="Search Assignments" />
				</div>
				<AssignmentsList sort={sortBy} course={course} assignments={assignments} />
			</div>
		);
	}
});
