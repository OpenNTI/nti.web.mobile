import React from 'react/addons';
import mixin from '../mixins/Mixin';
import {LISTS} from '../Constants';
import Avatar from 'common/components/Avatar';
import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

export default React.createClass({
	displayName: 'Contacts:Groups',
	mixins: [mixin],
	storeType: LISTS,

	getDefaultProps () {
		return {
			listClassName: 'lists avatar-grid'
		};
	},

	renderListItem (item) {
		return (
			<li key={item.displayName}>
				<a href={encodeForURI(item.getID())}>
					<div>
						<Avatar entity={item} />
						{item.displayName}

					</div>
				</a>
			</li>
		);
	}

});
