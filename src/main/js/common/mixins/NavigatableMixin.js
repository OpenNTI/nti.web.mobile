import {join} from 'path';

import Awareness from './NavigationAware';


/**
 * NavigatableMixin
 *
 * A mixin for a component which operates in context of a router and can
 * navigate to a deeper route, or to a different route
 */
export default {
	mixins: [Awareness],

	makeHref (path, includeCurrentRoute) {
		let n = this.getNavigable();

		if (includeCurrentRoute) {
			let route = (n.getMatch() || {}).matchedPath || '';
			console.error('FIXME: If there is a subrouter active, move the component requesting this down into the sub-router');

			path = join(route, path);
		}

		return n.makeHref(path);
	},


	buildHref (path) {
		let parent = /^\.\.\//;
		let n = this.getNavigable();
		let p;

		//This feels like a hack :/
		while (parent.test(path)) {
			p = n.getParentRouter();
			if (!p) { break; }
			n = p;
			path = path.replace(parent, '');
		}

		if (p) { path = '/' + path; }

		return n.makeHref(path);
	},


	navigate (path, navigation, cb) {
		let parent = /^\.\.\//;
		let n = this.getNavigable();
		let p;

		//This feels like a hack :/
		while (parent.test(path)) {
			p = n.getParentRouter();
			if (!p) { break; }
			n = p;
			path = path.replace(parent, '');
		}

		if (p) { path = '/' + path; }

		return n.navigate(path, navigation, cb);
	},


	navigateRoot (path, navigation, cb) {
		const nav = this.getNavigable();
		const env = nav.getEnvironment ? nav.getEnvironment() : nav;
		return env.setPath(path, navigation, cb);
	}
};
