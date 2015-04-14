import React from 'react';
import Mixin from './Mixin';

import isEmpty from 'nti.lib.interfaces/utils/isempty';

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

		let value = this.state.value;

		return (
			<form className="free-response">
				<input ref="input" value={value} onChange={this.handleInteraction} onBlur={this.onBlur}/>
			</form>
		);
	},


	onBlur () {
		this.saveProgress();
	},


	getValue: function () {
		let ref = this.refs.input;
		let input = ref && ref.getDOMNode();
		let value = input && input.value;

		return isEmpty(value) ? null : value;
	}
});
