import React from 'react';

export default React.createClass({
	displayName: 'BufferedInput',

	propTypes: {
		onChange: React.PropTypes.func,
		delay: React.PropTypes.number
	},


	onChange (e) {
		const {delay = 0, onChange} = this.props;
		if (!onChange) {
			return;
		}

		let {inputBufferDelayTimer} = this;
		if (inputBufferDelayTimer) {
			clearTimeout(inputBufferDelayTimer);
		}

		// take this event out of the pool since we need to access it asynchronously.
		// see https://facebook.github.io/react/docs/events.html#event-pooling
		e.persist();

		this.inputBufferDelayTimer = setTimeout(() => onChange(e), delay);
	},

	render () {
		return (
			<input {...this.props} onChange={this.onChange}/>
		);
	}
});
