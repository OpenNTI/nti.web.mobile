import React from 'react';

import {Mixins} from 'nti-web-commons';
import ContextSender from 'common/mixins/ContextSender';
import AvatarGrid from '../AvatarGrid';
import {profileHref} from '../../mixins/ProfileLink';
import {Loading} from 'nti-web-commons';
import ProfileBodyContainer from '../ProfileBodyContainer';
import {PromiseButton} from 'nti-web-commons';

export default React.createClass({
	displayName: 'Community:Members',
	mixins: [Mixins.BasePath, ContextSender],

	propTypes: {
		entity: React.PropTypes.object,

		nested: React.PropTypes.bool
	},

	getInitialState () {
		return {
		};
	},

	getContext () {
		let {entity, nested} = this.props;
		let base = this.getBasePath() + profileHref(entity);

		return Promise.resolve([
			{
				label: 'Members',
				href: base + (nested ? 'info/' : '') + 'members/'
			}
		]);
	},

	setUpStore (props = this.props) {
		let {entity} = props;
		let store = null;
		if (entity) {
			store = entity.getMembers();
		}
		this.setState({store});
	},

	componentDidMount () {
		this.setUpStore();
	},

	componentWillReceiveProps (nextProps) {
		let {entity} = nextProps;

		if(entity !== this.props.entity) {
			this.setUpStore(nextProps);
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

		if (nextStore && nextStore !== store) {
			nextStore.addListener('change', this.onStoreChange);

			// if (!nextStore.loading) {
			// 	console.log('Wut?');
			// }
		}
	},

	onStoreChange () {
		this.forceUpdate();
	},

	more () {
		let {store} = this.state;
		return store.nextBatch();
	},

	render () {
		let {store} = this.state;
		if (!store || (store.loading && !store.length)) {
			return ( <Loading /> );
		}

		return (
			<ProfileBodyContainer className="members community-info">
				<div>
					<h2>Community Members</h2>
					<AvatarGrid entities={store} />
					{ store.more && <PromiseButton className="more" onClick={this.more}>More</PromiseButton> }
				</div>
			</ProfileBodyContainer>
		);
	}
});
