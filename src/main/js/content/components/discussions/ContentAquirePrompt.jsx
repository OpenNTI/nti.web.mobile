import React from 'react';

export default React.createClass({
	displayName: 'ContentAquirePrompt',

	propTypes: {
		//The note or thing that points to content the user does not have access to.
		relatedItem: React.PropTypes.object,

		//The 403 response body
		data: React.PropTypes.object
	},

	render () {
		return (
			<div />
		);
	}
});
