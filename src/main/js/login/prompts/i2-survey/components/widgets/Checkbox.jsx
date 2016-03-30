import React from 'react';

import mixin from './mixin';

export default React.createClass({
	displayName: 'Checkbox',

	mixins: [mixin],

	propTypes: {
		name: React.PropTypes.string,
		option: React.PropTypes.shape({
			value: React.PropTypes.any,
			label: React.PropTypes.any
		}).isRequired
	},

	getInitialState () {
		return {};
	},

	render () {

		const {name, option} = this.props;

		if (!option || !this.satisfiesRequirement()) {
			return null;
		}

		const opt = typeof option === 'object' ? option : {label: option, value: option};

		return (
			<li>
				<label>
					<input type="checkbox"
						name={name}
						value={opt.value || opt.label} />
					<span>{opt.label}</span>
				</label>
			</li>
		);
	}
});
