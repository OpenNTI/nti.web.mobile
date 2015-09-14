import React from 'react';
import Mixin from './Mixin';

import isEmpty from 'fbjs/lib/isEmpty';

/**
* This input type represents Symbolic Math
*/
export default React.createClass({
	displayName: 'SymbolicMath',
	mixins: [Mixin],

	statics: {
		inputType: [
			'SymbolicMath'
		]
	},

	render () {

		let value = this.state.value;
		let submitted = this.isSubmitted();

		return (
			<form className="free-response">
				<input ref="input" value={value} onChange={this.handleInteraction} readOnly={submitted}/>
			</form>
		);
	},


	getValue () {
		const {input} = this.refs;
		const {value} = input || {};

		return isEmpty(value) ? null : value;
	}
});
