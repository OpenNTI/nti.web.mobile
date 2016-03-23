import React from 'react';

import SelectOption from './SelectOption';
import mixin from './mixin';

export default React.createClass({
	displayName: 'Select',

	mixins: [mixin],

	propTypes: {
		element: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {};
	},

	onChange (e) {
		this.setState({
			value: e.target.value
		});
	},


	render () {

		const {element} = this.props;

		if (!element || !this.satisfiesRequirement()) {
			return null;
		}

		return (
			<div className="select widget">
				<label>{element.label}</label>
				<select name={element.name} onChange={this.onChange} value={this.state.value}>
					<option />
					{element.options.map((o, i) =>
						<SelectOption key={i} option={o} requirement={o.requirement} />
					).filter(x => x)}
				</select>
			</div>
		);
	}
});
