import React from 'react/addons';
import mixin from '../mixins/Mixin';
import {USERS} from '../Constants';
import AvatarProfileLink from 'profile/components/AvatarProfileLink';

export default React.createClass({
	displayName: 'Contacts:Users',
	mixins: [mixin],
	storeType: USERS,

	getDefaultProps () {
		return {
			listClassName: 'users avatar-grid'
		};
	},

	renderListItem (item) {
		return (
			<li key={'avatar' + item.Username}>
				<AvatarProfileLink entity={item} />
			</li>
		);
	}

});
