import Api from '../Api';
import Store from '../Store';
import {OBJECT_CONTENTS_CHANGED} from '../Constants';

import NTIID from 'dataserverinterface/utils/ntiids';

const objectContentsChangedHandler = 'LoadForum:objectContentsChangedHandler';

module.exports = {
	componentDidMount: function() {
		if (!this.mixinAdditionalHandler) {
			console.warn('this.mixinAdditionalHandler is undefined. (Forgot to include the StoreEvents mixin?)');
			return;
		}
		this.mixinAdditionalHandler(OBJECT_CONTENTS_CHANGED, objectContentsChangedHandler);
		this._loadData(this.props.forumId);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChanged);
	},

	componentWillReceiveProps: function(nextProps) {
		if (nextProps.forumId !== this.props.forumId) {
			this._loadData(nextProps.forumId);
		}
	},

	[objectContentsChangedHandler]: function(event) {
		var {forumId} = this.props;
		if (NTIID.decodeFromURI(event.objectId) === NTIID.decodeFromURI(forumId)) {
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
