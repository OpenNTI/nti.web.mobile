import React from 'react';

import mixin from './mixin';

export default React.createClass({
	displayName: 'SelectOption',

	mixins: [mixin],

	propTypes: {
		option: React.PropTypes.shape({
			value: React.PropTypes.any,
			label: React.PropTypes.any
		})
	},

	render () {

		const {option = {}} = this.props;

		if (!option || !this.satisfiesRequirement()) {
			return null;
		}

		return (
			<option value={option.value || option.label}>{option.label || option.value}</option>
		);
	}
});
