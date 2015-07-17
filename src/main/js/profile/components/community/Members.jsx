import React from 'react';

import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';
import AvatarGrid from '../AvatarGrid';
import ProfileLink from '../ProfileLink';
import Loading from 'common/components/Loading';
import ProfileBodyContainer from '../ProfileBodyContainer';

export default React.createClass({
	displayName: 'Community:Members',
	mixins: [BasePathAware, ContextSender],

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
		let base = this.getBasePath() + ProfileLink.makeHref(entity);

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

	render () {
		let {store} = this.state;
		if (!store || (store.loading && !store.length)) {
			return ( <Loading /> );
		}

		return (
			<ProfileBodyContainer className="members community-info">
				<div>
					<h2>Community Members ({store.length})</h2>
					<AvatarGrid entities={store} />
				</div>
			</ProfileBodyContainer>
		);
	}
});
