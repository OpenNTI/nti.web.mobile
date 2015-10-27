import React from 'react';
import Mixin from './Mixin';

import isEmpty from 'fbjs/lib/isEmpty';

/**
 * This input type represents Free Response
 */
export default React.createClass({
	displayName: 'FreeResponse',
	mixins: [Mixin],
	saveBuffer: 10000,//10seconds

	statics: {
		inputType: [
			'FreeResponse'
		]
	},

	render () {
		const {state: {value}} = this;

		return (
			<form className="free-response">
				<input ref="input" value={value} onChange={this.handleInteraction} onBlur={this.onBlur} readOnly={this.isSubmitted()}/>
			</form>
		);
	},


	onBlur () {
		this.saveProgress();
	},


	getValue () {
		const {refs: {input = {}}} = this;
		const {value} = input;

		return isEmpty(value) ? null : value;
	}
});
