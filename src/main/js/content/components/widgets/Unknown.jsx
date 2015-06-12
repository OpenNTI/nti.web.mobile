import React from 'react';

export default React.createClass({
	displayName: 'ContentWidgetUnknown',

	propTypes: {
		item: React.PropTypes.object
	},

	render () {
		let {type} = this.props.item;
		return (
			<error><span>Unknown Type:<br/>{type}</span></error>
		);
	}
});
