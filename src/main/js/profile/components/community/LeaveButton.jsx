import React from 'react';
import Button from 'common/forms/components/Button';

export default React.createClass({
	displayName: 'CommunityLeaveButton',

	render () {
		return (
			<Button className="leave-button">Leave Community</Button>
		);
	}
});
