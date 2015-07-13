import StorePrototype from 'common/StorePrototype';
import {FEED_CHANGED} from './Constants';

const FeedChanged = Symbol('feedChanged');

/*
	Simple store for notifying profile feeds of changes
	(so they can refresh when items are deleted, for example)
*/
class Store extends StorePrototype {

	constructor () {
		super();
		this.registerHandlers({
			[FEED_CHANGED]: FeedChanged
		});
	}

	[FeedChanged] () {
		this.emitChange({type: FEED_CHANGED});
	}

}

export default new Store();
