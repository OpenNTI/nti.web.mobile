const ROUTES = Symbol('Routes');


const makeRoute = (path, extra) => ({props: Object.assign({ handler: 'div', path }, extra || {})});

export default {

	getInitialState  () {
		this.getRoutes().push(makeRoute('/:pageId(/)'));

		this.registerContentViewerSubRoute('/discussions(/*)', {discussions: true});
	},


	componentWillMount () {

		let {makeHref} = this;

		this.makeHref = link => {
			let {pageId} = this.getPropsFromRoute();
			if (pageId) {
				if (pageId !== this.props.rootId) {
					link = `/${pageId}/${link}`;
				}
			}

			return makeHref.call(this, link);
		};
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
	getRoutes () {
		if (!this[ROUTES]) { this[ROUTES] = []; }
		return this[ROUTES];
	},


	registerContentViewerSubRoute (route, extra = {}) {
		if (typeof route !== 'string') {
			throw new Error('Invalid Argument');
		}
		let page = /^\/\:pageId/;

		let routes = [
			makeRoute('/:pageId' + route, extra),
			makeRoute(route, extra)
		];

		let s = o => o.props.path;

		let set = this.getRoutes();

		set.push(...routes);

		//We have to ensure the '/:pageId' routes are last. And that the /:pageId(/) route is the last.
		set.sort((a, b)=> {
			a = s(a);
			b = s(b);

			let x = page.test(a);
			let y = page.test(b);

			if (x === y) {
				return -a.localeCompare(b);
			}

			return x ? 1 : -1;
		});
	}
};
