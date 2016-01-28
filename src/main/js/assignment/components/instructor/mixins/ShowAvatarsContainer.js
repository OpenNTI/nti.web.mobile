import {PropTypes} from 'react';

export default {

	getInitialState () {
		return {
			showAvatars: true
		};
	},

	childContextTypes: {
		showAvatars: PropTypes.bool,
		setShowAvatars: PropTypes.func
	},

	getChildContext () {
		return {
			showAvatars: this.state.showAvatars,
			setShowAvatars: (bool) => this.setState({showAvatars: bool})
		};
	}

};
