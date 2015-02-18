import React from 'react';
import Router from 'react-router-component';
import {join} from 'path';

import Url from 'url';

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
		return this.context.router || Router.environment.defaultEnvironment;
	},


	getPath () { return this.getNavigable().getPath(); },


	makeHref (path, includeCurrentRoute) {
		var n = this.getNavigable(),
			route = (n.getMatch() || {}).matchedPath || '';

		if (includeCurrentRoute) {
			path = join(route, path);
		}

		return n.makeHref(path);
 	},


	makeParentRouterHref (path) {
		var n = this.getNavigable();

		n = n.getParentRouter() || n;

		return n.makeHref(path);
	},


	navigate (path, cb) {
		return this.getNavigable().navigate(path, cb);
	},


	gotoFragment (fragment) {
		var e = this.getNavigable();
		var p = e.getPath();
		var u = Url.parse(p);

		u.hash = fragment;

		e.navigate(u.format(), {});
	}
};
