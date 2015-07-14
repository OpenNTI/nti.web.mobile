import React from 'react/addons';

import Avatar from './Avatar';
import DisplayName from './DisplayName';

import BasePathAware from '../mixins/BasePath';

import {encode} from '../utils/user';

import {join} from 'path';

/**
 * Renders the user session box (user's avatar, name, logout link, profile link)
 */
export default React.createClass({
	displayName: 'Session',
	mixins: [BasePathAware],

	propTypes: {
		username: React.PropTypes.string.isRequired,

		children: React.PropTypes.any
	},


	render () {
		let {children, username} = this.props;

		let base = this.getBasePath();

		let profile = join(base, 'profile', encode(username));

		return (
			<a className="user-session" href={profile}>
				<Avatar entity={username}/>
				<div className="meta">
					<DisplayName entity={username}/>
					<div>View Profile</div>
				</div>
				<div className="actions">
					{children}
				</div>
			</a>
		);
	}
});
