import {OBJECT_LOADED} from '../Constants';
import NTIID from 'nti.lib.interfaces/utils/ntiids';

const objectLoadedHandler = 'KeepItemInState:objectLoadedHandler';

module.exports = {

	componentWillMount() {
		if (!this.mixinAdditionalHandler) {
			console.warn('this.mixinAdditionalHandler is undefined. (Forgot to include the StoreEvents mixin?)');
			return;
		}
		this.mixinAdditionalHandler(OBJECT_LOADED, objectLoadedHandler);
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			busy: false,
			item: nextProps.item || this.props.item
		});
	},

	[objectLoadedHandler]: function(event) {
		var {object} = event;
		if (object && object.getID && object.getID() === this._itemId()) {
			this.setState({
				item: object
			});
		}
	},

	_itemFromStore() {
		return this._getPropId && this.backingStore && this.backingStore.getObject && this.backingStore.getObject(this._getPropId());
	},

	_item: function() {
		return ((this.state && this.state.item) || this.props.item || this._itemFromStore());
	},

	_itemId: function() {
		var i = this._item();
		var id = i && i.getID ? i.getID() : (this._getPropId ? this._getPropId() : null);
		return id && NTIID.decodeFromURI(id);
	}

};
