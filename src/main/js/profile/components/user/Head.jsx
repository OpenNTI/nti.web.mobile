import React from 'react/addons';

import Avatar from 'common/components/Avatar';
import HeadSummary from './HeadSummary';

export default React.createClass({
	displayName: 'profile:Head',

	propTypes: {
		children: React.PropTypes.any,

		entity: React.PropTypes.any.isRequired
	},

	render () {
		let {children, entity} = this.props;

		return (
			<div className="profile-head user-profile">
				<div className="user">
					<div className="profile-avatar-container">
						<Avatar entity={entity}/>
					</div>
					<HeadSummary entity={entity} />
				</div>
				{children}
			</div>
		);
	}
});
