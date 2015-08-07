import React from 'react/addons';
import mixin from '../mixins/Mixin';
import {GROUPS} from '../Constants';
import AvatarProfileLink from 'profile/components/AvatarProfileLink';

export default React.createClass({
	displayName: 'Contacts:Groups',
	mixins: [mixin],
	storeType: GROUPS,

	getDefaultProps () {
		return {
			listClassName: 'groups avatar-grid'
		};
	},

	renderListItem (item) {
		return (
			<li key={item.displayName}>
				<div>
					<AvatarProfileLink entity={item} />
				</div>
			</li>
		);
	}
});
