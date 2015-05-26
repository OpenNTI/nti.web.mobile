import React from 'react';


export default React.createClass({
	displayName: 'content:AnnotationGutter',

	propTypes: {
		items: React.PropTypes.object
	},

	componentDidMount () {
		this.resolveBins(this.props.items);
	},


	componentWillReceiveProps (nextProps) {
		this.resolveBins(nextProps.items);
	},


	resolveBins (items = {}) {

		console.log(items);

	},


	render () {
		return (
			<div />
		);
	}
});
