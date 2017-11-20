import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import HasMembers, {classesFor} from '../mixins/HasMembers';

import AvatarGrid from './AvatarGrid';
import ProfileBodyContainer from './ProfileBodyContainer';

export default createReactClass({
	displayName: 'Members',

	mixins: [HasMembers],

	propTypes: {
		entity: PropTypes.object.isRequired
	},

	classesFunc (...args) {
		const {entity} = this.props;
		return classesFor(entity.creator, ...args);
	},

	render () {
		const {entity} = this.props;

		const entities = this.getMembers(entity, false);

		return (
			<ProfileBodyContainer className="members">
				<div>
					<div className="members-section administrators">
						<h2>Administrators</h2>
						<AvatarGrid entities={[entity.creator]} classesFor={this.classesFunc} />
					</div>
					<div className="members-section">
						<h2>Members</h2>
						<AvatarGrid entities={entities} classesFor={this.classesFunc} />
					</div>
				</div>
			</ProfileBodyContainer>
		);
	}
});
