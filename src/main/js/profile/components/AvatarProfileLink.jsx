import React from 'react';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import FollowButton from 'common/components/FollowButton';

import ProfileLink from './ProfileLink';

export default React.createClass({
	displayName: 'AvatarProfileLink',

	propTypes: {
		entity: React.PropTypes.any.isRequired,
		children: React.PropTypes.any
	},

	render () {

		let e = this.props.entity;

		return (
			<ProfileLink entity={e}>
				<Avatar entity={e} suppressProfileLink />
				<div className="body">
					<DisplayName entity={e} suppressProfileLink />
					{e.location && <span className="location" dangerouslySetInnerHTML={{__html: e.location}}/>}
					{this.props.children}
				</div>
				{e.follow && <FollowButton entity={e} />}
			</ProfileLink>
		);
	}
});
