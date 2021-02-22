import React from 'react';

import PopUp from '../PopUp';

export default {
	getPopUp() {
		return this.state.popup;
	},

	onDismissPopUp() {
		this.setState({
			popup: null,
		});
	},

	renderPopUp() {
		let popup = this.getPopUp();
		if (popup) {
			return React.createElement(PopUp, {
				download: popup.download,
				source: popup.source,
				onClose: this.onDismissPopUp,
			});
		}
	},
};
