import {join} from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {Mixins} from '@nti/web-commons';
import {getAppUsername, User} from '@nti/web-client';

import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';
import {logout} from 'login/Actions';

import Impersonate from './Impersonate';

/**
 * Renders the user session box (user's avatar, name, logout link, profile link)
 */
export default createReactClass({
	displayName: 'Session',
	mixins: [Mixins.BasePath],

	propTypes: {
		children: PropTypes.any
	},


	render () {
		let {children} = this.props;

		let base = this.getBasePath();

		let entity = getAppUsername();

		let profile = join(base, 'profile', User.encode(entity));
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
