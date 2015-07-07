import React from 'react';
import AvatarGrid from './AvatarGrid';
import GroupMembers from './group/Members';
import ProfileBodyContainer from './ProfileBodyContainer';

export default React.createClass({
	displayName: 'Members',

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},

	render () {

		let {entity} = this.props;
		let entities = (entity || {}).friends;

		return (
			<ProfileBodyContainer className="group-members">
				<div>
					<h2>Group Members ({entities.length})</h2>
					<AvatarGrid entities={entities} />
				</div>
				<GroupMembers entity={entity} />
			</ProfileBodyContainer>
		);
	}
});
