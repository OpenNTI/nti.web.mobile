
import {makeHref} from 'profile/components/ProfileLink';

export default class EntityPathResolver {

	static handles (o) {
		return o.isCommunity || o.isGroup || o.isUser;
	}


	static resolve (o) {
		return new EntityPathResolver(o).getPath();
	}


	constructor (o) {
		this.entity = o;
	}

	getPath () {
		return Promise.resolve(makeHref(this.entity));
	}
}
