import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import AvatarGrid from '../AvatarGrid';
import {Link} from 'react-router-component';
import HasMembers from '../../mixins/HasMembers';

export default createReactClass({
	displayName: 'Group:Members',

	mixins: [HasMembers],

	propTypes: {
		entity: PropTypes.object.isRequired
	},

	render () {

		let {entity} = this.props;
		let entities = this.getMembers(entity).slice(0, 30);

		return (
			<div className="group-members-container">
				<div className="group-members-heading">
					<div className="member-count">Members</div>
					<Link className="view-all-link" href="/members/">View All</Link>
				</div>
				<AvatarGrid entities={entities} creator={entity.creator} hideFollow/>
			</div>
		);
	}
});
