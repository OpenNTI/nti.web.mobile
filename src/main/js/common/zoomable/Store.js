import StorePrototype from '../StorePrototype';
import {SRC_CHANGED} from './Constants';
let imgSrc;

class Store extends StorePrototype {

	setZoomable(src) {
		imgSrc = src;
		this.emitChange({
			type: SRC_CHANGED,
			src: imgSrc
		});
	}

	getZoomable () {
		return imgSrc;
	}
}

export default new Store();
