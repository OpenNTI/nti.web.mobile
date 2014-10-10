'use strict';

var React = require('react/addons');
var Router = require('react-router-component');
var join = require('path').join;

/**
 * NavigatableMixin
 *
 * A mixin for a component which operates in context of a router and can
 * navigate to a deeper route, or to a different route
 */
var NavigatableMixin = {

	contextTypes: {
		router: React.PropTypes.any
	},

	/** @private */
	_getNavigable: function() {
		return this.context.router || Router.environment.defaultEnvironment;
	},


	getPath: function() { return this._getNavigable().getPath(); },


	makeHref: function(path, includeCurrentRoute) {
		var n = this._getNavigable(),
			route = (n.getMatch() || {}).matchedPath || '';

		if (includeCurrentRoute) {
			path = join(route, path);
		}

		return n.makeHref(path);
 	}
};

module.exports = NavigatableMixin;
