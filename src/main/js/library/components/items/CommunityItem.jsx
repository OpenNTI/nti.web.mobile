import React from 'react';

import ProfileLink from 'profile/components/ProfileLink';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

export default React.createClass({
	displayName: 'CommunityItem',

	statics: {
		handles (item) {
			return item.isCommunity;
		}
	},

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	render () {
		const {props: {item}} = this;
		return (
			<ProfileLink entity={item} className="community-item">
				<Avatar entity={item}/>
				<DisplayName entity={item}/>
			</ProfileLink>
		);
	}
});
