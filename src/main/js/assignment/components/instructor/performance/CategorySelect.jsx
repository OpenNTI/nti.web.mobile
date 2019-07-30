import PropTypes from 'prop-types';
import React from 'react';
import {SelectBox} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

const t = scoped('nti-web-mobile.assignment.components.instructor.performance.CategorySelect', {
	all: 'All Items',
	actionable: 'Actionable Items',
	overdue: 'Overdue Items',
	ungraded: 'Ungraded Items'
});

const OPTIONS = [
	{ get label () { return t('all'); }, value: 'all'},
	{ get label () { return t('actionable'); }, value: 'actionable'},
	{ get label () { return t('overdue'); }, value: 'overdue'},
	{ get label () { return t('ungraded'); }, value: 'ungraded'}
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
