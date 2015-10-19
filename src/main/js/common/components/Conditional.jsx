import React from 'react';

export default React.createClass({
	displayName: 'Conditional',

	propTypes: {
		condition: React.PropTypes.bool,
		tag: React.PropTypes.any
	},


	getDefaultProps () {
		return { tag: 'div' };
	},

	render () {
		let {condition, tag} = this.props;
		return condition ? React.createElement(tag, this.props) : null;
	}
});
