import React from 'react';

import Transition from 'react-addons-css-transition-group';

import Logger from 'nti-util-logger';

import {Error as Err, Loading, Mixins} from 'nti-web-commons';

import {StoreEventsMixin} from 'nti-lib-store';

import {scoped} from 'nti-lib-locale';

import {clearLoadingFlag} from 'common/utils/react-state';

import keyFor from '../utils/key-for-item';

import Store from '../Store';
import {loadDiscussions} from '../Api';
import {DISCUSSIONS_CHANGED} from '../Constants';

import ForumBin from './widgets/ForumBin';

const logger = Logger.get('forums:components:ForumListView');

const t = scoped('FORUMS.groupTitles');
const discussionsChanged = 'ForumListView:discussionsChangedHandler';
const getContentPackage = 'ForumListView:getContentPackage';
const getContentPackageId = 'ForumListView:getContentPackageId';

export default React.createClass({
	displayName: 'ForumListView',

	mixins: [
		StoreEventsMixin, Mixins.NavigatableMixin
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

	[discussionsChanged] (event) {
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
		loadDiscussions(contentPackage)
			.then(
				result => {
					Store.setDiscussions(contentPackage.getID(), result);
					Store.setPackageId(contentPackage.getID());
				},
				error => {
					logger.error('Failed to load discussions', error);
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
				<Transition transitionName="fadeOutIn"
					transitionAppear
					transitionAppearTimeout={500}
					transitionEnterTimeout={500}
					transitionLeaveTimeout={500}
				>
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
