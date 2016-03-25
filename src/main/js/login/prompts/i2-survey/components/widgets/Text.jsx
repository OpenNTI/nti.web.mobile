import React from 'react';

import mixin from './mixin';

export default React.createClass({
	displayName: 'Text',

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
				<label className="question-label">{element.label}</label>
				<input type="text" name={element.name} onChange={this.onChange} value={this.state.value}/>
			</div>
		);
	}
});
