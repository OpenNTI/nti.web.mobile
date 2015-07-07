import React from 'react';
import AvatarGrid from '../AvatarGrid';
import {Link} from 'react-router-component';

export default React.createClass({
	displayName: 'GroupMembers',

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},

	render () {

		let {entity} = this.props;
		let entities = ((entity || {}).friends || []).slice(0, 30);

		return (
			<div className="group-members-container">
				<div className="group-members-heading">
					<div className="member-count">Members ({entities.length})</div>
					<Link className="view-all-link" href="/members/">View All</Link>
				</div>
				<AvatarGrid entities={entities} />
			</div>

		);
	}
});
