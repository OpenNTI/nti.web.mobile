import React from 'react';


import Avatar from './Avatar';
import DisplayName from './DisplayName';
import Impersonate from './Impersonate';

import BasePathAware from '../mixins/BasePath';

import {getAppUsername} from '../utils';
import {encode} from '../utils/user';
import {logout} from 'login/Actions';
import {join} from 'path';

/**
 * Renders the user session box (user's avatar, name, logout link, profile link)
 */
export default React.createClass({
	displayName: 'Session',
	mixins: [BasePathAware],

	propTypes: {
		children: React.PropTypes.any
	},


	render () {
		let {children} = this.props;

		let base = this.getBasePath();

		let entity = getAppUsername();

		let profile = join(base, 'profile', encode(entity));
		let contacts = join(base, 'contacts', '/');

		return (
			<div className="user-session">
				<Avatar entity={entity}/>
				<div className="meta">
					<DisplayName entity={entity}/>
				</div>
				<div className="actions">
					<Impersonate/>
					{children}
				</div>
				<ul className="links">
					<li><a href={profile}>View Profile</a></li>
					<li><a href={contacts}>Contacts</a></li>
					<li><a onClick={logout}>Log Out</a></li>
				</ul>
			</div>
		);
	}
});
