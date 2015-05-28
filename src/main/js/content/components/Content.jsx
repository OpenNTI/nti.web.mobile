import React from 'react';

function getComparable (o) {
	return o.dangerouslySetInnerHTML.__html;//eslint-disable-line no-underscore-dangle
}

export default React.createClass({
	displayName: 'content:Viewer:BodyContent',

	getInitialState () {
		return {};
	},

	componentDidMount () {
		this.updatePrestine();
	},

	componentDidUpdate (prevProps) {
		if (getComparable(prevProps) !== getComparable(this.props)) {
			this.updatePrestine();
		}
	},


	getCurrent () {
		return React.findDOMNode(this.refs.content);
	},


	getPristine () {
		return this.state.prestine;
	},


	updatePrestine () {
		let current = this.getCurrent();
		let prestine = current && current.cloneNode(true);
		this.setState({prestine});
		// console.debug('Updated Prestine', prestine);
	},

	render () {
		return (
			<div {...this.props} ref="content"/>
		);
	}
});
