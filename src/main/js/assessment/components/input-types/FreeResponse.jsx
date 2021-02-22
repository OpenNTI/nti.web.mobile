import './FreeResponse.scss';
import React from 'react';
import createReactClass from 'create-react-class';
import { isEmpty } from '@nti/lib-commons';

import Mixin, { stopEvent } from './Mixin';

/**
 * This input type represents Free Response
 */
export default createReactClass({
	displayName: 'FreeResponse',
	mixins: [Mixin],
	saveBuffer: 10000, //10seconds

	statics: {
		inputType: ['FreeResponse'],
	},

	attachRef(x) {
		this.input = x;
	},

	onChange({ target: { value } }) {
		this.handleInteraction();
		this.setState({ value });
	},

	render() {
		const {
			state: { value },
		} = this;

		return (
			<form className="free-response" onSubmit={stopEvent}>
				<input
					ref={this.attachRef}
					value={value || ''}
					onChange={this.onChange}
					onBlur={this.onBlur}
					readOnly={this.isSubmitted()}
				/>
			</form>
		);
	},

	onBlur() {
		this.saveProgress();
	},

	getValue() {
		const { input = {} } = this;
		const { value } = input;

		return isEmpty(value) ? null : value.trim();
	},
});
