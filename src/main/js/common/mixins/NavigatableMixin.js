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

	/** @private */
	_getNavigable () {
		return this.context.router || Router.environment.defaultEnvironment;
	},


	getPath () { return this._getNavigable().getPath(); },


	makeHref (path, includeCurrentRoute) {
		var n = this._getNavigable(),
			route = (n.getMatch() || {}).matchedPath || '';

		if (includeCurrentRoute) {
			path = join(route, path);
		}

		return n.makeHref(path);
 	},


	makeParentRouterHref (path) {
		var n = this._getNavigable();

		n = n.getParentRouter() || n;

		return n.makeHref(path);
	},


	navigate (path, cb) {
		return this._getNavigable().navigate(path, cb);
	},


	gotoFragment (fragment) {
		var e = this._getNavigable();
		var p = e.getPath();
		var u = Url.parse(p);

		u.hash = fragment;

		e.navigate(u.format(), {});
	}
};
