import React from 'react';

export default React.createClass({
	displayName: 'ContentWidgetUnknown',

	propTypes: {
		item: React.PropTypes.object
	},

	render () {
		let {type} = this.props.item;
		return (
			<div>Unknown Type: {type}</div>
		);
	}
});
