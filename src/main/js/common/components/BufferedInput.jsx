import React from 'react';

export default React.createClass({
	displayName: 'BufferedInput',

	propTypes: {
		onChange: React.PropTypes.func,
		delayMs: React.PropTypes.number
	},


	onChange (e) {
		const {delayMs = 0, onChange} = this.props;
		if (!onChange) {
			return;
		}

		let {inputBufferDelayTimer} = this;
		if (inputBufferDelayTimer) {
			clearTimeout(inputBufferDelayTimer);
		}

		//TODO: capture a shallow clone of the event's properties like key, keyCode, type, name, target etc.
		//The reason is that the event object will likely have dirty data after the event execution occurs.
		//(either from object reuse, or weakreferences that get cleaned.)
		this.inputBufferDelayTimer = setTimeout(() => onChange(e), delayMs);
	},

	render () {
		return (
			<input {...this.props} onChange={this.onChange}/>
		);
	}
});
