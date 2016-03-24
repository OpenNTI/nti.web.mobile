import React from 'react';

import mixin from './mixin';

export default React.createClass({
	displayName: 'Number',

	mixins: [mixin],

	propTypes: {
		element: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {
		};
	},

	onChange (e) {
		this.setState({ value: e.target.value });
	},

	render () {
		const {element} = this.props;

		if (!element || !this.satisfiesRequirement()) {
			return null;
		}

		return (
			<div className="text widget">
				<label>{element.label}</label>
				<input type="number" pattern="\d*" name={element.name} onChange={this.onChange} value={this.state.value}/>
			</div>
		);
	}
});
