export default {
	toggleState (propname, event) {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}

		this.setState({
			[propname]: !this.state[propname]
		});
	}
};
