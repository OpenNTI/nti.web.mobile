import React from 'react';
import Mixin from './Mixin';

import isEmpty from 'nti.lib.interfaces/utils/isempty';

const isValid = /^[0-9\-\/\\,\.\*¼-¾]*$/;

/**
 * This input type represents Numeric Math
 */
export default React.createClass({
	displayName: 'NumericMath',
	mixins: [Mixin],

	statics: {
		inputType: [
			'NumericMath'
		]
	},

	render () {

		let value = this.state.value || '';

		return (
			<form className="free-response">
				<input ref="input" value={value} onChange={this.handleInteraction}/>
			</form>
		);
	},


	getValue: function () {
		let ref = this.refs.input;
		let input = ref && React.findDOMNode(ref);
		let value = (input && input.value) || '';

		return isEmpty(value) ? null :
				!isValid.test(value) ?
					(this.state.value || null) : value;
	}
});
