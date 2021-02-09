import React from 'react';
import PropTypes from 'prop-types';
import {decorate} from '@nti/lib-commons';
import {SelectBox} from '@nti/web-commons';

import Assignments from '../bindings/Assignments';

const ORDER_BY = (name, i) => i.props.assignments[`ORDER_BY_${name}`];

class SortBox extends React.Component {

	static propTypes = {
		assignments: PropTypes.object,
		onChange: PropTypes.func.isRequired,
		value: PropTypes.any,
	}

	state = {
		sortBy: this.props.value || ORDER_BY('LESSON', this),
		sortOptions: [
			{ label: 'By Due Date', value: ORDER_BY('DUE_DATE', this) },
			{ label: 'By Lesson', value: ORDER_BY('LESSON', this) },
			{ label: 'By Completion', value: ORDER_BY('COMPLETION', this) }
		],
	}

	componentDidUpdate () {
		const { props: {value}, state: { sortBy } } = this;
		if (value && value !== sortBy) {
			this.setState({sortBy: value});
		}
	}

	render () {

		const {sortOptions, sortBy} = this.state;

		return (
			<SelectBox options={sortOptions} onChange={this.props.onChange} value={sortBy} />
		);
	}
}


export default decorate(SortBox, [
	Assignments.connect
]);
