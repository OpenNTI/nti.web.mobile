import React from 'react';
import Router from 'react-router-component';
import {join} from 'path';


/**
 * NavigatableMixin
 *
 * A mixin for a component which operates in context of a router and can
 * navigate to a deeper route, or to a different route
 */
export default {

	contextTypes: {
		router: React.PropTypes.any
	},


	getNavigable () {
		let {environment} = this.props;
		if (environment) {
			return environment;
		}

		return this.context.router || Router.environment.defaultEnvironment;
	},


	getPath () { return this.getNavigable().getPath(); },


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


	makeParentRouterHref (path) {
		let n = this.getNavigable();

		n = n.getParentRouter() || n;

		return n.makeHref(path);
	},


	navigate (path, cb) {
		let parent = /^\.\.\//;
		let n = this.getNavigable();

		//This feels like a hack :/
		while (parent.test(path)) {
			let p = n.getParentRouter();
			if (!p) { break; }
			n = p;
			path = path.replace(parent, '');
		}

		return n.navigate(path, cb);
	}
};
