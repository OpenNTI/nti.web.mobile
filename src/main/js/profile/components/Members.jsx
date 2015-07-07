import React from 'react';
import AvatarGrid from './AvatarGrid';
import GroupMembers from './group/GroupMembers';

export default React.createClass({
	displayName: 'Members',

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},

	render () {

		let {entity} = this.props;
		let entities = (entity || {}).friends;

		return (
			<div className="profile-members-container">
				<div className="profile-memberships-container"><GroupMembers entity={entity} /></div>
				<AvatarGrid entities={entities} />
			</div>
		);
	}
});
