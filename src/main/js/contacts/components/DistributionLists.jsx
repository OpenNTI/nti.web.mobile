import React from 'react/addons';
import mixin from '../mixins/Mixin';
import {LISTS} from '../Constants';

export default React.createClass({
	displayName: 'Contacts:Groups',
	mixins: [mixin],
	storeType: LISTS,

	getDefaultProps () {
		return {
			listClassName: 'lists'
		};
	}
});
