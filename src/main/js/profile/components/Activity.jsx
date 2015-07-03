import React from 'react';

import Loading from 'common/components/TinyLoader';
import Button from 'common/forms/components/Button';

import BasePathAware from 'common/mixins/BasePath';

import Card from './Card';

import Joined from './activity/Joined';

import HasItems from './activity/HasItems';

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

	more () {
		let {store} = this.state;
		// let el = React.findDOMNode(this.refs.more);
		// if (el) {
		// 	el = el.previousSibling;
		// }

		store.nextBatch();
			// .then(()=> {
			// 	el = el && el.nextSibling;
			// 	if (el) {
			// 		el.scrollIntoView(true);
			// 	}
			// });
	},

	render () {
		let {store} = this.state;

		if (!store || (store.loading && !store.length)) {
			return ( <Loading /> );
		}

		return (
			<ul className="profile-cards activity">
				{store.map((a, index) => {

					// // localize the last segment of the mime type for the card title.
					let mime = a.MimeType.split('.').pop();
					// let title = t(mime);

					return (
						<Card key={`${a.NTIID}:${index}`} className={mime}>
							{this.renderItems(a)}
						</Card>
					);
				})}

				{!store.more && <Card><Joined user={this.props.user} /></Card>}

				{store.more && (
					<li ref="more">
						<Card key="morebutton">
							{store.loading
								? ( <Loading/> )
								: ( <Button onClick={this.more}>More</Button>
							)}
						</Card>
					</li>
				)}

			</ul>
		);
	}
});
