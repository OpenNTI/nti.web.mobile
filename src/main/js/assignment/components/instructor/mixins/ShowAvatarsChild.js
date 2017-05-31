import PropTypes from 'prop-types';

export default {

	contextTypes: {
		showAvatars: PropTypes.bool,
		setShowAvatars: PropTypes.func
	},

	getShowAvatars () {
		return this.context.showAvatars;
	},

	setShowAvatars (value) {
		this.context.setShowAvatars(value);
	}

};
