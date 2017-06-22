import React from 'react';
import createReactClass from 'create-react-class';
import {getService} from 'nti-web-client';
import {Mixins} from 'nti-web-commons';

import Container from './Container';


export default createReactClass({
	displayName: 'Community',
	mixins: [Mixins.ItemChanges],

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
