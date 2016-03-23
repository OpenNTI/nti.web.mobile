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

		return (
			<li>
				<label>
					<input type="radio"
						onChange={this.onChange}
						name={name}
						value={option.value || option.label} />
					<span>{option.label}</span>
				</label>
			</li>
		);
	}
});
