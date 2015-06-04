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
			console.error('TODO: Consolidate route-link methodology.');
			/*console.debug('Is this needed??\n\tA: %s\n\tB:%s\n\n\t%s\n\t%s',
				path,
				join(route,path),
				n.makeHref(path),
				n.makeHref(join(route,path)));*/

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
	}
};
