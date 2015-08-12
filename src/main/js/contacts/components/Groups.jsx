import React from 'react/addons';
import mixin from '../mixins/Mixin';
import {GROUPS} from '../Constants';
import AvatarProfileLink from 'profile/components/AvatarProfileLink';
import ListMeta from './ListMeta';

export default React.createClass({
	displayName: 'Contacts:Groups',
	mixins: [mixin],
	storeType: GROUPS,
	listName: 'Groups',

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
					<ListMeta entity={item} />
				</div>
			</li>
		);
	}
});
