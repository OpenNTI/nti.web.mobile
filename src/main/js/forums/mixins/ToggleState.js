'use strict';

module.exports = {
	_toggleState: function(propname, event) {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		this.setState({
			[propname]: !this.state[propname]
		});
	}
};

