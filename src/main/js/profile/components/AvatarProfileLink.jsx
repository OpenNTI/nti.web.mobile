import React from 'react';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

import ProfileLink from './ProfileLink';

export default React.createClass({
	displayName: 'AvatarProfileLink',

	propTypes: {
		entity: React.PropTypes.any.isRequired
	},

	render () {

		let e = this.props.entity;

		return (
			<ProfileLink entity={e}>
				<Avatar entity={e} />
				<div className="body">
					<DisplayName entity={e} />
					<span className="location" dangerouslySetInnerHTML={{__html: e.location}}/>
				</div>
			</ProfileLink>
		);
	}
});
