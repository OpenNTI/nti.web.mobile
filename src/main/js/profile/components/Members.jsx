import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import AvatarGrid from './AvatarGrid';
import ProfileBodyContainer from './ProfileBodyContainer';
import HasMembers, {classesFor} from '../mixins/HasMembers';

export default createReactClass({
	displayName: 'Members',

	mixins: [HasMembers],

	propTypes: {
		entity: PropTypes.object.isRequired
	},

	render () {

		let {entity} = this.props;
		let entities = this.getMembers(entity, false);
		const classesFunc = (...args) => classesFor(entity.creator, ...args);

		return (
			<ProfileBodyContainer className="members">
				<div>
					<div className="members-section administrators">
						<h2>Administrators</h2>
						<AvatarGrid entities={[entity.creator]} classesFor={classesFunc} />
					</div>
					<div className="members-section">
						<h2>Members</h2>
						<AvatarGrid entities={entities} classesFor={classesFunc} />
					</div>
				</div>
			</ProfileBodyContainer>
		);
	}
});
