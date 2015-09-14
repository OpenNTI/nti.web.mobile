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
		let {value} = this.state;
		let submitted = this.isSubmitted();

		return (
			<form className="free-response">
				<input ref="input" value={value} onChange={this.handleInteraction} onBlur={this.onBlur} readOnly={submitted}/>
			</form>
		);
	},


	onBlur () {
		this.saveProgress();
	},


	getValue () {
		const {input: value} = this.refs || {};

		return isEmpty(value) ? null : value;
	}
});
