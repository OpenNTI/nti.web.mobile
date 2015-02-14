export default {

	getInitialState  () {
		this.__registerRoute('/:pageId/');
	},


	getDefaultProps  () {
		return { contextual: true };
	},


	getPropsFromRoute  (fallback) {
		var m = this.getMatch();
		var props = m && (m.getHandler() || m.match);
		return props || fallback;
	},


	setRoutingState (...args) { this.setState(...args); },


	/**
	 * For the RouterMixin
	 * @private
	 * @param {Object} props
	 */
	getRoutes (/*props*/) {
		if (!this.__routes) {
			debugger;
		}
		return this.__routes || [];
	},


	__registerRoute (route) {
		if (typeof route === 'string') {
			route = {
				props: {
					handler (p) {return p;},
					path: route
				}
			};
		}

		var set = this.__routes = this.__routes || [];
		set.push(route);
	}
};
