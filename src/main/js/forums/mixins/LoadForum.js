import {decodeFromURI} from 'nti-lib-ntiids';
import Logger from 'nti-util-logger';

import {getForumContents} from '../Api';
import Store from '../Store';
import {ITEM_CONTENTS_CHANGED} from '../Constants';

import paging from './Paging';

const ChangedHandler = 'LoadForum:ChangedHandler';
const LoadData = 'LoadForum:LoadData';

const logger = Logger.get('forums:mixins:LoadForum');

export default {
	componentWillMount () {
		if (!this.registerStoreEventHandler) {
			logger.warn('this.registerStoreEventHandler is undefined. (Forgot to include the StoreEvents mixin?)');
			return;
		}
		this.registerStoreEventHandler(ITEM_CONTENTS_CHANGED, ChangedHandler);
		this[LoadData](this.props.forumId);
	},

	componentWillReceiveProps (nextProps) {
		if (nextProps.forumId !== this.props.forumId || paging.batchStart() !== this.state.batchStart) {
			this[LoadData](nextProps.forumId);
			this.setState({
				loading: true,
				batchStart: paging.batchStart()
			});
		}
	},

	[ChangedHandler] (event) {
		let {forumId} = this.props;
		if (decodeFromURI(event.itemId) === decodeFromURI(forumId)) {
			this.setState({
				loading: false
			});
		}
	},

	[LoadData] (forumId) {
		getForumContents(forumId, paging.batchStart(), paging.getPageSize())
			.then(
				result => {
					Store.setForumItem(forumId, result.item);
					Store.setForumItemContents(forumId, result.contents, result.params);
				},
				reason => {
					Store.setForumItem(forumId, reason);
					Store.setForumItemContents(forumId, reason);
				});
	}
};
