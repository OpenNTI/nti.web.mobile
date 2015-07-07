import React from 'react';

import Loading from 'common/components/TinyLoader';
import Button from 'common/forms/components/Button';

import BasePathAware from 'common/mixins/BasePath';

import Card from './Card';

import Joined from './activity/Joined';

import HasItems from './activity/HasItems';
import GroupMembers from './group/GroupMembers';
import ProfileBodyContainer from './ProfileBodyContainer';

export default React.createClass({
	displayName: 'Activity',

	mixins: [HasItems, BasePathAware],

	propTypes: {
		entity: React.PropTypes.object,
		entityType: React.PropTypes.string // we hang 'group' here to trigger membership rendering.
	},

	getInitialState () {
		return {};
	},


	componentDidMount () {
		this.setUser();
	},


	componentWillReceiveProps (nextProps) {
		let {entity} = nextProps;

		if(entity !== this.props.entity) {
			this.setUser(entity);
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


	setUser (entity = this.props.entity) {
		let store = null;
		if (entity) {
			store = entity.getActivity();
		}

		this.setState({store});
	},

	more () {
		let {store} = this.state;
		// let el = React.findDOMNode(this.refs.end);
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
		let {entity, entityType} = this.props;

		if (!store || (store.loading && !store.length)) {
			return ( <Loading /> );
		}

		return (
			<ProfileBodyContainer className="activity">
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

					{(entity.isUser || store.more) && (
					<Card ref="end" key="theend" className="end">
						{store.more
							? store.loading
								? ( <Loading/> )
								: ( <Button className="more" onClick={this.more}>More</Button> )
							: (
							<Joined entity={entity} />
						)}
					</Card>
					)}
				</ul>
				{
					entityType === 'group' && <GroupMembers entity={entity} />
				}
			</ProfileBodyContainer>
		);
	}
});
