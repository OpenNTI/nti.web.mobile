import React from 'react';

import Loading from 'common/components/TinyLoader';
import Button from 'common/forms/components/Button';
import EmptyList from 'common/components/EmptyList';

import BasePathAware from 'common/mixins/BasePath';

import Card from './Card';

import Joined from './activity/Joined';

import HasItems from './activity/HasItems';

export default React.createClass({
	displayName: 'Activity',

	mixins: [HasItems, BasePathAware],

	propTypes: {
		entity: React.PropTypes.object,

		filterParams: React.PropTypes.object
	},

	getInitialState () {
		return {};
	},


	componentDidMount () {
		this.setupStore();
	},


	componentWillReceiveProps (nextProps) {
		let {entity, filterParams} = nextProps;

		if(entity !== this.props.entity || filterParams !== nextProps.filterParams) {
			this.setupStore(nextProps);
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


	setupStore (props = this.props) {
		let {entity, filterParams} = props;
		let store = null;
		if (entity) {
			store = entity.getActivity(filterParams);
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
		let {entity} = this.props;

		if (!store || (store.loading && !store.length)) {
			return ( <Loading /> );
		}

		return (
			<ul className="profile-cards activity">
				{store.length === 0 && <Card key='emptyList'><EmptyList type="activity"/></Card>}
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
		);
	}
});
