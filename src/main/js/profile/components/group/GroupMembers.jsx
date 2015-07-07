import React from 'react';
import AvatarGrid from './AvatarGrid';

export default React.createClass({
	displayName: 'GroupMembers',

	render () {
		return (
			<div>
				<AvatarGrid entities={[]} />
			</div>

		);
	}
});
