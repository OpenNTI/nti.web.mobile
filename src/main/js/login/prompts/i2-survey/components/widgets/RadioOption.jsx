import React from 'react';

import mixin from './mixin';

export default React.createClass({
	displayName: 'RadioOption',

	mixins: [mixin],

	propTypes: {
		name: React.PropTypes.string,
		option: React.PropTypes.shape({
			value: React.PropTypes.any,
			label: React.PropTypes.any
		}).isRequired,
		onChange: React.PropTypes.func
	},

	getInitialState () {
		return {};
	},

	render () {

		const {name, option, onChange} = this.props;

		if (!option || !this.satisfiesRequirement()) {
			return null;
		}

		const opt = typeof option === 'object' ? option : {label: option, value: option};

		return (
			<li>
				<label>
					<input type="radio"
						onChange={onChange}
						name={name}
						value={opt.value || opt.label} />
					<span>{opt.label}</span>
				</label>
			</li>
		);
	}
});
