import React from 'react/addons';

import Loading from 'common/components/Loading';
import Err from 'common/components/Error';
import mixin from '../mixins/Mixin';
import {GROUPS} from '../Constants';

export default React.createClass({
	displayName: 'Contacts:Groups',
	mixins: [mixin],
	storeType: GROUPS,

	render () {

		let {error, store} = this.state;

		if (error) {
			return <Err error={error} />;
		}

		if (!store || store.loading) {
			return <Loading />;
		}

		let items = [];
		for(let item of store) {
			items.push(<li key={item.Username}>{item.displayName}</li>);
		}

		return (
			<div>
				<ul>{items}</ul>
			</div>
		);
	}
});
