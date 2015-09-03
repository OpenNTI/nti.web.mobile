import React from 'react';
import Placeholder from './Placeholder';

export default React.createClass({
	displayName: 'TimeLockedPlaceholder',


	propTypes: {
		assignment: React.PropTypes.object
	},


	onBack (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		//Temp:
		history.go(-1);
	},


	render () {
		const {props:{assignment}} = this;
		const props = {
			assignment,
			message: 'This assignment has not opened yet. Come back later.',
			buttonLabel: 'Back',
			pageTitle: 'Not Available Yet',
			onConfirm: this.onBack
		};

		return (
			<Placeholder {...props} />
		);
	}
});
