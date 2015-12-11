import React from 'react';
import SelectBox from 'common/components/SelectBox';

const OPTIONS = [
	{ label: 'All Items', value: 'all'},
	{ label: 'Actionable Items', value: 'actionable'},
	{ label: 'Overdue Items', value: 'overdue'},
	{ label: 'Ungraded Items', value: 'ungraded'}
];

export default React.createClass({
	displayName: 'ItemCategorySelect',

	propTypes: {
		value: React.PropTypes.any,
		onChange: React.PropTypes.func.isRequired
	},

	componentWillMount () {
		this.setState({filter: this.props.value || 'all'});
	},

	render () {

		let {filter} = this.state;

		return (
			<SelectBox options={OPTIONS} onChange={this.props.onChange} value={filter} />
		);
	}
});
