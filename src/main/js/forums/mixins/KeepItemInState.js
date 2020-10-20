import {decodeFromURI} from '@nti/lib-ntiids';
import Logger from '@nti/util-logger';

import {ITEM_LOADED} from '../Constants';

const LoadedHandler = 'KeepItemInState:LoadedHandler';
const logger = Logger.get('forums:mixins:KeepItemInState');

export default {

	// eslint-disable-next-line camelcase
	UNSAFE_componentWillMount () {
		if (!this.registerStoreEventHandler) {
			logger.warn('this.registerStoreEventHandler is undefined. (Forgot to include the StoreEvents mixin?)');
			return;
		}
		this.registerStoreEventHandler(ITEM_LOADED, LoadedHandler);
	},

	componentDidUpdate (prevProps) {
		this.setState({
			busy: false,
			item: this.props.item || prevProps.item
		});
	},


	[LoadedHandler] (event) {
		let {item} = event;
		if (item && item.getID && item.getID() === this.getItemId()) {
			this.setState({
				item: item
			});
		}
	},


	getItemFromStore () {
		return this.getPropId && this.backingStore && this.backingStore.getForumItem && this.backingStore.getForumItem(this.getPropId());
	},


	getItem () {
		return ((this.state && this.state.item) || this.props.item || this.getItemFromStore());
	},

	getItemId () {
		let i = this.getItem();
		let id = i && i.getID ? i.getID() : (this.getPropId ? this.getPropId() : null);
		return id && decodeFromURI(id);
	}

};
