import React from 'react';

export default class SocialSecurityNumberField extends React.Component {
	attachRef = x => (this.input = x);

	onKeyUp = () => {
		const { input } = this;

		let value = input.value.replace(/\D/g, ''); // strip non-digit characters

		if (value.length > 4) {
			this.value = value;
		}

		const output = [];

		if (value.length > 3 && value.length < 6) {
			output.push(value.substr(0, 3), '-');

			value = value.substr(3);
		}

		if (value.length > 5) {
			output.push(value.substr(0, 3), '-');
			output.push(value.substr(3, 2), '-');
			value = value.substr(5);
		}

		output.push(value);

		input.value = output.join('');
	};

	render() {
		return (
			<input
				ref={this.attachRef}
				type="tel"
				pattern="\d*"
				onKeyUp={this.onKeyUp}
			/>
		);
	}
}
