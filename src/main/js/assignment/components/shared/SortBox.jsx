import React from 'react';
import PropTypes from 'prop-types';
import {SelectBox} from 'nti-web-commons';

import Assignments from '../bindings/Assignments';

export default
@Assignments.connect
class SortBox extends React.Component {

	static propTypes = {
		assignments: PropTypes.object,
		onChange: PropTypes.func.isRequired,
		value: PropTypes.any,
	}

	componentWillMount () {
		const {ORDER_BY_COMPLETION, ORDER_BY_DUE_DATE, ORDER_BY_LESSON} = this.props.assignments;

		const sortOptions = [
			{ label: 'By Due Date', value: ORDER_BY_DUE_DATE},
			{ label: 'By Lesson', value: ORDER_BY_LESSON},
			{ label: 'By Completion', value: ORDER_BY_COMPLETION}
		];

		this.setState({sortOptions, sortBy: this.props.value || ORDER_BY_LESSON});
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.value) {
			this.setState({sortBy: nextProps.value});
		}
	}

	render () {

		let {sortOptions, sortBy} = this.state;

		return (
			<SelectBox options={sortOptions} onChange={this.props.onChange} value={sortBy} />
		);
	}
}
