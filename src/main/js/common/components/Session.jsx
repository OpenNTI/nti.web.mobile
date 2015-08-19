import React from 'react/addons';


import Avatar from './Avatar';
import C from './Conditional';
import DisplayName from './DisplayName';

import BasePathAware from '../mixins/BasePath';

import {getAppUsername, isFlag} from '../utils';
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
				<ul className="links">
					<li><a href={profile}>View Profile</a></li>
					<C condition={isFlag('contacts')} tag="li"><a href={contacts}>Contacts</a></C>
					<li><a onClick={logout}>Log Out</a></li>
				</ul>
				<div className="actions">
					{children}
				</div>
			</div>
		);
	}
});
