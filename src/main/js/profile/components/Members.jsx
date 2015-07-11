import React from 'react';
import AvatarGrid from './AvatarGrid';
import GroupMembers from './group/Members';
import ProfileBodyContainer from './ProfileBodyContainer';
import HasMembers, {classesFor} from '../mixins/HasMembers';

export default React.createClass({
	displayName: 'Members',

	mixins: [HasMembers],

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},

	render () {

		let {entity} = this.props;
		let entities = this.getMembers(entity);

		return (
			<ProfileBodyContainer className="members">
				<div>
					<h2>Group Members ({entities.length})</h2>
					<AvatarGrid entities={entities} classesFor={classesFor.bind(null, entity.creator)} />
				</div>
				<GroupMembers entity={entity} />
			</ProfileBodyContainer>
		);
	}
});
