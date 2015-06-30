import React from 'react';

export default React.createClass({
	displayName: 'StringWidget',

	propTypes: {
		item: React.PropTypes.string.isRequired
	},

	statics: {
		handles (item) {
			return typeof item === 'string';
		}
	},

	render () {
		return <div>{this.props.item}</div>;
	}
});
