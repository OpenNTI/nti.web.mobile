import React from 'react/addons';
import mixin from '../mixins/Mixin';
import {GROUPS} from '../Constants';
import Avatar from 'common/components/Avatar';

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
					<Avatar entity={item} />
					{item.displayName}
				</div>
			</li>
		);
	}
});
