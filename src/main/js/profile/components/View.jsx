import React from 'react/addons';

export default React.createClass({
	displayName: 'profile:View',

	render () {
		return (
			<div>{this.props.username}</div>
		);
	}
});
