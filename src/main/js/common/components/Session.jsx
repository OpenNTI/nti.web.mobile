import React from 'react/addons';


import Avatar from './Avatar';
import DisplayName from './DisplayName';

import BasePathAware from '../mixins/BasePath';

import {getAppUsername} from '../utils';
import {encode} from '../utils/user';

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

		return (
			<a className="user-session" href={profile}>
				<Avatar entity={entity}/>
				<div className="meta">
					<DisplayName entity={entity}/>
					<div>View Profile</div>
				</div>
				<div className="actions">
					{children}
				</div>
			</a>
		);
	}
});
