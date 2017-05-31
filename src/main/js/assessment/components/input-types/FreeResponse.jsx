import React from 'react';
import createReactClass from 'create-react-class';
import Mixin, {stopEvent} from './Mixin';

import isEmpty from 'isempty';


/**
 * This input type represents Free Response
 */
export default createReactClass({
	displayName: 'FreeResponse',
	mixins: [Mixin],
	saveBuffer: 10000,//10seconds

	statics: {
		inputType: [
			'FreeResponse'
		]
	},


	onChange ({target: {value}}) {
		this.handleInteraction();
		this.setState({value});
	},


	render () {
		const {state: {value}} = this;

		return (
			<form className="free-response" onSubmit={stopEvent}>
				<input ref={x => this.input = x} value={value || ''} onChange={this.onChange} onBlur={this.onBlur} readOnly={this.isSubmitted()}/>
			</form>
		);
	},


	onBlur () {
		this.saveProgress();
	},


	getValue () {
		const {input = {}} = this;
		const {value} = input;

		return isEmpty(value) ? null : value.trim();
	}
});
