const ROUTES = Symbol('Routes');

export default {

	getInitialState  () {
		this.registerContentViewerSubRoute('/:pageId(/)');
	},


	getDefaultProps  () {
		return { contextual: true };
	},


	getPropsFromRoute  (props) {
		let {match} = this.getRouterState(props || this.props);
		let p = match && (match.getHandler() || match.match);
		if (p && p.props) {
			p = p.props;
		}

		return p || props;
	},


	setRoutingState (...args) { this.setState(...args); },


	/**
	 * For the RouterMixin
	 * @private
	 * @returns {Array} Route Objects
	 */
	getRoutes (/*props*/) {
		return this[ROUTES] || [];
	},


	registerContentViewerSubRoute (route) {
		if (typeof route === 'string') {
			route = {
				props: {
					handler: 'div',
					path: route
				}
			};
		}

		let set = this[ROUTES] = this[ROUTES] || [];
		set.push(route);
	}
};
