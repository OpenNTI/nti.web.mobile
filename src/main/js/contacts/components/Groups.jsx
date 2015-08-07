import React from 'react/addons';
import mixin from '../mixins/Mixin';
import {GROUPS} from '../Constants';

export default React.createClass({
	displayName: 'Contacts:Groups',
	mixins: [mixin],
	storeType: GROUPS,

	getDefaultProps () {
		return {
			listClassName: 'groups'
		};
	},

	renderListItem (item) {
		return (
			<li key={item}>{item.displayName}</li>
		);
	}
});
