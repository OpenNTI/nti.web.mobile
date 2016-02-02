import React from 'react';

function pluck (fromObject, ...keys) {
	let o = {};
	for (let key of keys) {
		let v = fromObject[key];
		if (v != null) {
			o[key] = v;
		}
	}
	return o;
}

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

		//capture a shallow clone of the event's properties like key, keyCode, type, name, target etc.
		//The reason is that the event object will likely have dirty data after the event execution occurs.
		//(either from object reuse, or weakreferences that get cleaned.)
		const eventClone = Object.assign(
			Object.create(e),
			pluck(e, 'key', 'keyCode', 'type', 'name', 'target')
		);

		this.inputBufferDelayTimer = setTimeout(() => onChange(eventClone), delay);
	},

	render () {
		return (
			<input {...this.props} onChange={this.onChange}/>
		);
	}
});
