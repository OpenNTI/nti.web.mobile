import React from 'react';
import cx from 'classnames';

import Loading from 'common/components/TinyLoader';
import Button from 'common/forms/components/Button';
import EmptyList from 'common/components/EmptyList';

import ItemsMixin from 'activity/RenderItemsMixin';
import Joined from 'activity/components/widgets/Joined';

import BasePathAware from 'common/mixins/BasePath';
import ProfileAnalytics from '../mixins/AnalyticsMixin';

import WriteSomething from './WriteSomething';

import {PROFILE_ACTIVITY_VIEWED} from 'nti-lib-interfaces/lib/models/analytics/MimeTypes';

export default React.createClass({
	displayName: 'Activity',

	mixins: [ItemsMixin, BasePathAware, ProfileAnalytics],

	propTypes: {
		entity: React.PropTypes.object,

		filterParams: React.PropTypes.object
	},

	getAnalyticsMimeType () {
		return PROFILE_ACTIVITY_VIEWED;
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


	profileStoreChange () {
		this.setupStore();
		let {store} = this.state;
		if (store) {
			store.addListener('change', this.onStoreChange);
		}
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
		// let el = this.refs.end;
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

		let canPost = !!store.postToActivity;

		return (
			<ul className="activity">
				{canPost && <li key="editor" className="activity-item card-write-something"><WriteSomething entity={entity} store={store}/></li> }
				{store.length === 0 && !entity.isUser && <li key="activity-item emptyList"><EmptyList type="activity"/></li>}
				{store.map((a, index) => {

					// // localize the last segment of the mime type for the card title.
					let mime = a.MimeType.split('.').pop();
					// let title = t(mime);

					return (
						<li key={`${a.NTIID}:${index}`} className={cx('activity-item', mime)}>
							{this.renderItems(a)}
						</li>
					);
				})}

				{(entity.isUser || store.more) && (
				<li ref="end" key="theend" className="activity-item end">
					{store.more
						? store.loading
							? ( <Loading/> )
							: ( <Button className="more" onClick={this.more}>More</Button> )
						: (
						<Joined entity={entity} />
					)}
				</li>
				)}
			</ul>
		);
	}
});
