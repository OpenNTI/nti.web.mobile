import React from 'react';
import SelectBox from 'common/components/SelectBox';

const OPTIONS = [
	{ label: 'Open Students', value: 'Open'},
	{ label: 'Enrolled Students', value: 'ForCredit'}
];

export default React.createClass({
	displayName: 'EnrollmentSelect',

	propTypes: {
		value: React.PropTypes.any,
		onChange: React.PropTypes.func.isRequired
	},

	render () {

		let filter = this.props.value || 'Open';

		return (
			<SelectBox options={OPTIONS} onChange={this.props.onChange} value={filter} />
		);
	}
});
