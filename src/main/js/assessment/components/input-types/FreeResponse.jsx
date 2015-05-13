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

		return (
			<form className="free-response">
				<input ref="input" value={value} onChange={this.handleInteraction} onBlur={this.onBlur}/>
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
