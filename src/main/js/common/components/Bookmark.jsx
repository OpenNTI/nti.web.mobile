import React from 'react';

export default React.createClass({
	displayName: 'Bookmark',

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	render () {
		return (
			<a className="bookmark"/>
		);
	}
});
