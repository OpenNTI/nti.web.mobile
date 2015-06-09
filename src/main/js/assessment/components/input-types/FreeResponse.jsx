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
		let {input} = this.refs;
		let {value} = (input && React.findDOMNode(input)) || {};

		return isEmpty(value) ? null : value;
	}
});
