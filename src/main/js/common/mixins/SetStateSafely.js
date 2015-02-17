export default {
	setStateSafely (state) {
		if (this.isMounted()) {
			this.setState(state);
		}
	}
};
