import React from 'react';
import AvatarGrid from './AvatarGrid';
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
		let entities = this.getMembers(entity, false);

		return (
			<ProfileBodyContainer className="members">
				<div>
					<div className="members-section administrators">
						<h2>Administrators</h2>
						<AvatarGrid entities={[entity.creator]} classesFor={classesFor.bind(null, entity.creator)} />
					</div>
					<div className="members-section">
						<h2>Members</h2>
						<AvatarGrid entities={entities} classesFor={classesFor.bind(null, entity.creator)} />
					</div>
				</div>
			</ProfileBodyContainer>
		);
	}
});
