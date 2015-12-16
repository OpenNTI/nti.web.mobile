import React from 'react';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

import ShowAvatars from '../mixins/ShowAvatarsChild';

export default React.createClass({
	displayName: 'StudentLink',

	mixins: [ShowAvatars],

	propTypes: {
		item: React.PropTypes.shape({
			user: React.PropTypes.object
		}).isRequired,
		children: React.PropTypes.any
	},

	render () {
		const {item} = this.props;
		const showAvatars = this.getShowAvatars();
		return (
			<a className="student-link" href={`./${encodeURIComponent(item.username)}/`}>
				{showAvatars && (<Avatar entity={item.user} suppressProfileLink />)}
				<div className="wrapper">
					<DisplayName entity={item.user} suppressProfileLink />
					{this.props.children}
				</div>
			</a>
		);
	}
});
