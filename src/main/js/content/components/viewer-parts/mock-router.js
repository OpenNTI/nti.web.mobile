'use strict';
module.exports = {

	getInitialState: function () {
		this.__registerRoute('/:pageId/');
	},


	getDefaultProps: function () {
		return {
			contextual: true
		};
	},


	getPropsFromRoute: function (fallback) {
		var m = this.getMatch();
		var props = m && (m.getHandler() || m.match);
		return props || fallback;
	},


	setRoutingState: function (state, cb) {
		this.setState(state, cb);
	},


	/**
	 * For the RouterMixin
	 * @private
	 * @param {Object} props
	 */
	getRoutes: function(/*props*/) {
		if (!this.__routes) {
			debugger;
		}
		return this.__routes || [];
	},


	__registerRoute: function(route) {
		if (typeof route === 'string') {
			route = {
				handler: function(p) {return p;},
				path: route
			};
		}

		var set = this.__routes = this.__routes || [];
		set.push(route);
	}
};
