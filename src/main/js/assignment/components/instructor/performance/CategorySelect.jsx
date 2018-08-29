import PropTypes from 'prop-types';
import React from 'react';
import {SelectBox} from '@nti/web-commons';

const OPTIONS = [
	{ label: 'All Items', value: 'all'},
	{ label: 'Actionable Items', value: 'actionable'},
	{ label: 'Overdue Items', value: 'overdue'},
	{ label: 'Ungraded Items', value: 'ungraded'}
];

export default class ItemCategorySelect extends React.Component {

	static propTypes = {
		value: PropTypes.any,
		onChange: PropTypes.func.isRequired
	}

	state = {
		filter: this.props.value || 'all'
	}

	componentDidUpdate (prevProps) {
		const filter = this.props.value || 'all';
		if (this.state.filter !== filter) {
			this.setState({ filter });
		}
	}

	render () {

		let {filter} = this.state;

		return (
			<SelectBox options={OPTIONS} onChange={this.props.onChange} value={filter} />
		);
	}
}
