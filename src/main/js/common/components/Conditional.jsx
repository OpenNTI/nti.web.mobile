import React from 'react';

export default React.createClass({
	displayName: 'Conditional',

	propTypes: {
		condition: React.PropTypes.bool,
		tag: React.PropTypes.any
	},

	componentWillMount () {
		console.warn('[Deprecated]: Predicate your tags with expressions instead: {exp && ( <jsx.../> )}');//eslint-disable-line no-console
	},

	getDefaultProps () {
		return { tag: 'div' };
	},

	render () {
		let {condition, tag} = this.props;
		return condition ? React.createElement(tag, this.props) : null;
	}
});
