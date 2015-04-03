import Api from '../Api';
import Store from '../Store';
import {OBJECT_CONTENTS_CHANGED} from '../Constants';

import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

const objectContentsChangedHandler = 'LoadForum:objectContentsChangedHandler';

module.exports = {
	componentWillMount: function() {
		if (!this.mixinAdditionalHandler) {
			console.warn('this.mixinAdditionalHandler is undefined. (Forgot to include the StoreEvents mixin?)');
			return;
		}
		this.mixinAdditionalHandler(OBJECT_CONTENTS_CHANGED, objectContentsChangedHandler);
		this._loadData(this.props.forumId);
	},

	componentWillReceiveProps: function(nextProps) {
		if (nextProps.forumId !== this.props.forumId) {
			this._loadData(nextProps.forumId);
		}
	},

	[objectContentsChangedHandler]: function(event) {
		var {forumId} = this.props;
		if (decodeFromURI(event.objectId) === decodeFromURI(forumId)) {
			this.setState({
				loading: false
			});
		}
	},

	_loadData: function(forumId) {
		Api.getObjectContents(forumId)
		.then(result => {
			Store.setObject(forumId, result.object);
			Store.setObjectContents(forumId, result.contents);
		});
	},
};
