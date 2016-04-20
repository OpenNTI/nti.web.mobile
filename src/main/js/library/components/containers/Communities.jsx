import React from 'react';

import Container from './Container';

import {getService} from 'nti-web-client';
import ItemChanges from 'common/mixins/ItemChanges';

export default React.createClass({
	displayName: 'Community',
	mixins: [ItemChanges],

	componentDidMount () {
		getService()
			.then(service => service.getCommunities())
			.then(store => this.setState({store})); //eslint-disable-line

	},


	getItem () {
		return (this.state || {}).store;
	},


	render () {
		let store = this.getItem();
		let items = store ? Array.from(store) : [];

		return (
			<Container section="communities" items={items}/>
		);
	}
});
