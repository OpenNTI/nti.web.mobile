import React from 'react';
import Mixin from './Mixin';

import isEmpty from 'nti.lib.interfaces/utils/isempty';

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
		let ref = this.refs.input;
		let input = ref && React.findDOMNode(ref);
		let value = input && input.value;

		return isEmpty(value) ? null : value;
	}
});
