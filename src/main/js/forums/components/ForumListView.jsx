import React from 'react';

import Transition from 'common/thirdparty/ReactCSSTransitionWrapper';

import Err from 'common/components/Error';
import Loading from 'common/components/Loading';

import StoreEvents from 'common/mixins/StoreEvents';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import {scoped} from 'common/locale';

import {clearLoadingFlag} from 'common/utils/react-state';

import keyFor from '../utils/key-for-item';

import Store from '../Store';
import Api from '../Api';
import {DISCUSSIONS_CHANGED} from '../Constants';

import ForumBin from './widgets/ForumBin';


const t = scoped('FORUMS.groupTitles');
const discussionsChanged = 'ForumListView:discussionsChangedHandler';
const getContentPackage = 'ForumListView:getContentPackage';
const getContentPackageId = 'ForumListView:getContentPackageId';

export default React.createClass({
	displayName: 'ForumListView',

	mixins: [
		StoreEvents, NavigatableMixin
	],

	propTypes: {
		/**
		 * @type {object} Any model that implements getDiscussions() and getID()
		 */
		contentPackage: React.PropTypes.shape({
			getDiscussions: React.PropTypes.func,
			getID: React.PropTypes.func
		})
	},

	backingStore: Store,
	backingStoreEventHandlers: {
		[DISCUSSIONS_CHANGED]: discussionsChanged
	},

	[discussionsChanged](event) {
		if(event.packageId === this[getContentPackageId]()) {
			clearLoadingFlag(this);
		}
	},

	getInitialState () {
		return {
			loading: true
		};
	},

	componentDidMount () {
		if(!Store.getDiscussions(this[getContentPackageId]())) {
			this.load();
		}
		else {
			clearLoadingFlag(this);
		}
	},

	load () {
		let contentPackage = this[getContentPackage]();
		Api.loadDiscussions(contentPackage)
			.then(
				result => {
					Store.setDiscussions(contentPackage.getID(), result);
					Store.setPackageId(contentPackage.getID());
				},
				error => {
					console.error('Failed to load discussions', error);
					this.setState({ error });
				});
	},

	[getContentPackageId] () {
		let p = this[getContentPackage]();
		return p && p.getID();
	},

	[getContentPackage] () {
		return this.props.contentPackage;
	},

	render () {

		if (this.state.loading) {
			return <Loading />;
		}

		let contentPackageId = this[getContentPackageId]();
		let discussions = Store.getDiscussions(contentPackageId);
		let err = this.state.error || ((discussions || {}).isError ? discussions.error : null);

		if (err) {
			return <Err error={discussions.error} />;
		}

		return (
			<div>
				<Transition transitionName="forums">
					<nav className="forum">
						<ul>
							{
								//convenient that the order we want the bins happens to be alphabeetical enrolled, open, other
								Array.sort(Object.keys(discussions)).map(key => {
									let bin = discussions[key];
									let reactkey = keyFor(bin);
									return <li key={reactkey}><ForumBin title={t(key.toLowerCase())} bin={bin} /></li>;
								})
							}
						</ul>
					</nav>
				</Transition>
			</div>
		);
	}
});
