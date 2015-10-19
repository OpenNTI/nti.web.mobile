import React from 'react';

export default React.createClass({
	displayName: 'Unknown',

	render () {
		console.warn('Unknown: ', this.props);
		return (
			<div>Unknown</div>
		);
	}
});
