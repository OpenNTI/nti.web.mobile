import Api from '../Api';
import Store from '../Store';
import {OBJECT_CONTENTS_CHANGED} from '../Constants';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';
import paging from './Paging';

const objectContentsChangedHandler = 'LoadForum:objectContentsChangedHandler';
const loadData = "LoadForum:loadData";

module.exports = {
	componentWillMount: function() {
		if (!this.mixinAdditionalHandler) {
			console.warn('this.mixinAdditionalHandler is undefined. (Forgot to include the StoreEvents mixin?)');
			return;
		}
		this.mixinAdditionalHandler(OBJECT_CONTENTS_CHANGED, objectContentsChangedHandler);
		this[loadData](this.props.forumId);
	},

	componentWillReceiveProps: function(nextProps) {
		if (nextProps.forumId !== this.props.forumId || paging.batchStart() !== this.state.batchStart) {
			this[loadData](nextProps.forumId);
			this.setState({
				batchStart: paging.batchStart()
			});
		}
	},

	[objectContentsChangedHandler]: function(event) {
		let {forumId} = this.props;
		if (decodeFromURI(event.objectId) === decodeFromURI(forumId)) {
			this.setState({
				loading: false
			});
		}
	},

	[loadData]: function(forumId) {
		Api.getForumContents(forumId, paging.batchStart(), paging.getPageSize())
		.then(result => {
			Store.setObject(forumId, result.object);
			Store.setObjectContents(forumId, result.contents, result.params);
		});
	}
};
