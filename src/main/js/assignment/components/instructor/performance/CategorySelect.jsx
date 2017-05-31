import PropTypes from 'prop-types';
import React from 'react';
import {SelectBox} from 'nti-web-commons';

const OPTIONS = [
	{ label: 'All Items', value: 'all'},
	{ label: 'Actionable Items', value: 'actionable'},
	{ label: 'Overdue Items', value: 'overdue'},
	{ label: 'Ungraded Items', value: 'ungraded'}
];

export default class extends React.Component {
    static displayName = 'ItemCategorySelect';

    static propTypes = {
		value: PropTypes.any,
		onChange: PropTypes.func.isRequired
	};

    componentWillMount() {
		this.setState({filter: this.props.value || 'all'});
	}

    componentWillReceiveProps(nextProps) {
		this.setState({filter: nextProps.value || 'all'});
	}

    render() {

		let {filter} = this.state;

		return (
			<SelectBox options={OPTIONS} onChange={this.props.onChange} value={filter} />
		);
	}
}
