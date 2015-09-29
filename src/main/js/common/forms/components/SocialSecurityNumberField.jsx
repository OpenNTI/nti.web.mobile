import React from 'react';

export default React.createClass({
	displayName: 'SocialSecurityNumberField',

	onKeyUp () {
		let input = React.findDOMNode(this.refs.input);
		let val = input.value.replace(/\D/g, ''); // strip non-digit characters
		let newVal = '';
		if(val.length > 4) {
			this.value = val;
		}
		if((val.length > 3) && (val.length < 6)) {
			newVal += val.substr(0, 3) + '-';
			val = val.substr(3);
		}
		if (val.length > 5) {
			newVal += val.substr(0, 3) + '-';
			newVal += val.substr(3, 2) + '-';
			val = val.substr(5);
		}
		newVal += val;
		input.value = newVal;
	},

	render () {
		return (
			<input ref="input" type="tel" pattern="\d*" onKeyUp={this.onKeyUp} />
		);
	}
});
