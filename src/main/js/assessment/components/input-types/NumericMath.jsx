import React from 'react';
import Mixin from './Mixin';

import isEmpty from 'fbjs/lib/isEmpty';

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
		let {value} = this.state;
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

		return isEmpty(value) ? null :
				!isValid.test(value) ?
					(this.state.value || null) : value;
	}
});
