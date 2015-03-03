export default {

	getInitialState  () {
		this.__registerRoute('/:pageId(/)');
	},


	getDefaultProps  () {
		return { contextual: true };
	},


	getPropsFromRoute  (props) {
		let {match} = this.getRouterState(props || this.props);
		var p = match && (match.getHandler() || match.match);
		if (p && p.props) {
			p = p.props;
		}

		return p || props;
	},


	setRoutingState (...args) { this.setState(...args); },


	/**
	 * For the RouterMixin
	 * @private
	 * @param {Object} props
	 */
	getRoutes (/*props*/) {
		return this.__routes || [];
	},


	__registerRoute (route) {
		if (typeof route === 'string') {
			route = {
				props: {
					handler: 'div',
					path: route
				}
			};
		}

		var set = this.__routes = this.__routes || [];
		set.push(route);
	}
};
