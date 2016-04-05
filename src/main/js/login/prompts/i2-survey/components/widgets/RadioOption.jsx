import React from 'react';

import mixin from './mixin';

export default React.createClass({
	displayName: 'RadioOption',

	mixins: [mixin],

	propTypes: {
		name: React.PropTypes.string,
		option: React.PropTypes.oneOfType([
			React.PropTypes.shape({
				value: React.PropTypes.any,
				label: React.PropTypes.any
			}),
			React.PropTypes.number,
			React.PropTypes.string
		]).isRequired,
		onChange: React.PropTypes.func,
		checked: React.PropTypes.bool
	},

	getInitialState () {
		return {};
	},

	render () {

		const {name, option, onChange, checked} = this.props;

		if (!option || !this.satisfiesRequirement()) {
			return null;
		}

		const opt = typeof option === 'object' ? option : {label: option, value: option};

		return (
			<li>
				<label>
					<input type="radio"
						onChange={onChange}
						checked={checked}
						name={name}
						value={opt.value || opt.label} />
					<span>{opt.label || opt.value}</span>
				</label>
			</li>
		);
	}
});
