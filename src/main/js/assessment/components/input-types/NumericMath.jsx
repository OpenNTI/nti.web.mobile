import React from 'react';
import createReactClass from 'create-react-class';

import { isEmpty } from '@nti/lib-commons';

import Mixin, { stopEvent } from './Mixin';

const isValid = /^[0-9\-/\\,.*¼-¾]*$/;

/**
 * This input type represents Numeric Math
 */
export default createReactClass({
	displayName: 'NumericMath',
	mixins: [Mixin],

	statics: {
		inputType: ['NumericMath'],
	},

	attachRef(x) {
		this.input = x;
	},

	render() {
		let { value } = this.state;
		let submitted = this.isSubmitted();

		return (
			<form className="free-response" onSubmit={stopEvent}>
				<input
					ref={this.attachRef}
					value={value}
					onChange={this.handleInteraction}
					readOnly={submitted}
				/>
			</form>
		);
	},

	getValue() {
		const { input } = this;
		const { value } = input || {};

		return isEmpty(value)
			? null
			: !isValid.test(value)
			? this.state.value || null
			: value;
	},
});
