import React from 'react';

import Loading from 'common/components/TinyLoader';
import BasePathAware from 'common/mixins/BasePath';
import {scoped} from 'common/locale';


import Card from './Card';

import HasItems from './activity/HasItems';

// let t = scoped('PROFILE.ACTIVITY.TITLES');

export default React.createClass({
	displayName: 'Activity',

	mixins: [HasItems, BasePathAware],

	propTypes: {
		user: React.PropTypes.object
	},

	getInitialState () {
		return {};
	},


	componentDidMount () {
		this.setUser();
	},


	componentWillReceiveProps (nextProps) {
		let {user} = nextProps;

		if(user !== this.props.user) {
			this.setUser(user);
		}
	},


	componentWillUnmount () {
		let {store} = this.state;
		if (store) {
			store.removeListener('change', this.onStoreChange);
		}
	},


	componentWillUpdate (_, nextState) {
		let {store} = this.state;
		let nextStore = nextState.store;

		if (store && store !== nextStore) {
			store.removeListener('change', this.onStoreChange);
		}
		else if (nextStore && nextStore !== store) {
			nextStore.addListener('change', this.onStoreChange);

			if (!nextStore.loading) {
				console.log('Wut?');
			}
		}
	},


	onStoreChange () {
		this.forceUpdate();
	},


	setUser (user = this.props.user) {
		let store = null;
		if (user) {
			store = user.getActivity();
		}

		this.setState({store});
	},


	render () {
		let {store} = this.state;

		if (!store || store.loading) {
			return ( <Loading /> );
		}

		return (
			<ul className="profile-cards activity">
				{store.map((a, index) => {

					// // localize the last segment of the mime type for the card title.
					let mime = a.MimeType.split('.').pop();
					// let title = t(mime);

					return (
						<Card key={a.NTIID + index} className={mime}>
							{this.renderItems(a)}
						</Card>
					);
				})}
			</ul>
		);
	}
});
