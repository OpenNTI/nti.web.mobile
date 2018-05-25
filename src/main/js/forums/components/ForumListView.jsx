import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Logger from '@nti/util-logger';
import {Error as Err, Loading, Mixins} from '@nti/web-commons';
import {StoreEventsMixin} from '@nti/lib-store';
import {scoped} from '@nti/lib-locale';
import { Link } from 'react-router-component';

import {clearLoadingFlag} from 'common/utils/react-state';

import keyFor from '../utils/key-for-item';
import Store from '../Store';
import {loadDiscussions} from '../Api';
import { DISCUSSIONS_CHANGED } from '../Constants';

import ForumBin from './widgets/ForumBin';

const logger = Logger.get('forums:components:ForumListView');

const DEFAULT_TEXT = {
	forcredit: 'Enrolled For-Credit',
	open: 'Open Discussions',
	other: 'Other Discussions',
	create: 'Create a forum'
};

const t = scoped('forums.groups.sections', DEFAULT_TEXT);
const discussionsChanged = 'ForumListView:discussionsChangedHandler';

export default createReactClass({
	displayName: 'ForumListView',

	mixins: [
		StoreEventsMixin, Mixins.NavigatableMixin
	],

	propTypes: {
		/**
		 * Any model that implements getDiscussions() and getID()
		 * @type {object}
		 */
		contentPackage: PropTypes.shape({
			getDiscussions: PropTypes.func,
			getID: PropTypes.func
		})
	},

	backingStore: Store,
	backingStoreEventHandlers: {
		[DISCUSSIONS_CHANGED]: discussionsChanged
	},

	[discussionsChanged] (event) {
		if(event.contextID === this.getContentPackageID()) {
			clearLoadingFlag(this);
		}
	},

	getInitialState () {
		return {
			loading: true
		};
	},

	componentDidMount () {
		if(!Store.getDiscussions(this.getContentPackageID()) || Store.shouldReload()) {
			Store.loadDiscussions(this.getContentPackage());
		}
		else {
			clearLoadingFlag(this);
		}
	},

	getContentPackageID () {
		let p = this.getContentPackage();
		return p && p.getID();
	},

	getContentPackage () {
		return this.props.contentPackage;
	},

	canCreateForum () {
		const contentPackage = this.getContentPackage();
		return contentPackage && contentPackage.Discussions && contentPackage.Discussions.hasLink('add');
	},

	createForum () {
		if (!this.canCreateForum()) {
			return null;
		}
		return <Link className="action-link create-forum" href="/newforum/">{t('create')}</Link>;
	},

	render () {

		if (this.state.loading) {
			return <Loading.Mask />;
		}

		let contentPackageID = this.getContentPackageID();
		let discussions = Store.getDiscussions(contentPackageID);
		let err = this.state.error || ((discussions || {}).isError ? discussions.error : null);

		if (err) {
			return <Err error={discussions.error} />;
		}

		return (
			<TransitionGroup>
				<CSSTransition appear classNames="fade-out-in" timeout={500} key="forum">
					<nav className="forum">
						<ul>
							{
								//convenient that the order we want the bins happens to be alphabeetical enrolled, open, other
								Array.sort(Object.keys(discussions)).map((key, i, bins) => {
									let bin = discussions[key];
									let reactkey = keyFor(bin);
									return (
										<li key={reactkey}>
											<ForumBin
												title={key.toLowerCase() === 'other' && bins.length === 1 ? '' : t(key.toLowerCase())}
												bin={bin}
											/>
										</li>
									);
								})
							}
						</ul>
						{Store.isSimple(contentPackageID) && this.createForum()}
					</nav>
				</CSSTransition>
			</TransitionGroup>
		);
	}
});
