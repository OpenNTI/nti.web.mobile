import React from 'react';

import mixin from './mixin';

import Text from './Text';

export default React.createClass({
	displayName: 'Checkbox',

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
		]).isRequired
	},

	getInitialState () {
		return {};
	},

	validate () {
		if (this.otherInput && this.otherInput.validate) {
			return this.otherInput.validate();
		}
		return true;
	},

	onChange (e) {
		this.setState({
			checked: e.target.checked
		});
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
						onChange={this.onChange}
						name={name}
						value={opt.value || opt.label} />
					<span>{opt.label}</span>
				</label>
				{option.includeTextInput && this.state.checked && <Text ref={x => this.otherInput = x} element={{name: `${name}-other`, required: true}} />}
			</li>
		);
	}
});
