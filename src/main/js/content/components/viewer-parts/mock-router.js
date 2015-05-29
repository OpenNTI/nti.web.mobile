const ROUTES = Symbol('Routes');

export default {

	getInitialState  () {
		let discussions = {discussions: true};
		this.registerContentViewerSubRoute('/:pageId/discussions(/(:discussionId))', discussions);
		this.registerContentViewerSubRoute('/:pageId(/)');
	},


	getDefaultProps  () {
		return { contextual: true };
	},


	getPropsFromRoute  (props) {
		props = Object.assign({contextual: true}, props || this.props);

		let {match} = this.getRouterState(props);
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


	registerContentViewerSubRoute (route, extra) {
		if (typeof route === 'string') {
			route = {
				props: Object.assign(extra || {}, {
					handler: 'div',
					path: route
				})
			};
		}

		let set = this[ROUTES] = this[ROUTES] || [];
		set.push(route);
	}
};
