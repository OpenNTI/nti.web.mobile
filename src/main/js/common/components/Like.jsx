import React from 'react';

export default React.createClass({
	displayName: 'Like',

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	render () {
		return (
			<a className="like"/>
		);
	}
});
