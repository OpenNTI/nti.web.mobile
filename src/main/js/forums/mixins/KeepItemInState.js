import {OBJECT_LOADED} from '../Constants';
import {decodeFromURI} from 'nti.lib.interfaces/utils/ntiids';

const objectLoadedHandler = 'KeepItemInState:objectLoadedHandler';

export default {

	componentWillMount () {
		if (!this.registerStoreEventHandler) {
			console.warn('this.registerStoreEventHandler is undefined. (Forgot to include the StoreEvents mixin?)');
			return;
		}
		this.registerStoreEventHandler(OBJECT_LOADED, objectLoadedHandler);
	},

	componentWillReceiveProps (nextProps) {
		this.setState({
			busy: false,
			item: nextProps.item || this.props.item
		});
	},


	[objectLoadedHandler] (event) {
		let {object} = event;
		if (object && object.getID && object.getID() === this.getItemId()) {
			this.setState({
				item: object
			});
		}
	},


	getItemFromStore () {
		return this.getPropId && this.backingStore && this.backingStore.getObject && this.backingStore.getObject(this.getPropId());
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
