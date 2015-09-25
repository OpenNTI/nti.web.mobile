import React from 'react';
import SelectBox from 'common/components/SelectBox';

export default React.createClass({
	displayName: 'SortBox',

	propTypes: {
		assignments: React.PropTypes.object.isRequired,
		value: React.PropTypes.any,
		onChange: React.PropTypes.func.isRequired
	},

	componentWillMount () {
		const {props: {assignments: {ORDER_BY_COMPLETION, ORDER_BY_DUE_DATE, ORDER_BY_LESSON}}} = this;

		const sortOptions = [
			{ label: 'By Due Date', value: ORDER_BY_DUE_DATE},
			{ label: 'By Lesson', value: ORDER_BY_LESSON},
			{ label: 'By Completion', value: ORDER_BY_COMPLETION}
		];

		this.setState({sortOptions, sortBy: this.props.value || ORDER_BY_DUE_DATE});
	},

	render () {

		let {sortOptions, sortBy} = this.state;

		return (
			<SelectBox options={sortOptions} onChange={this.props.onChange} value={sortBy} />
		);
	}
});
