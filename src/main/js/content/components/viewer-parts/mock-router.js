import Logger from 'nti-util-logger';

import {Mixins} from 'nti-web-commons';
import Path from 'path';

const ROUTES = Symbol('Routes');

const makeRoute = (path, extra) => ({props: {handler: 'div', path, ...(extra || {})}});

const logger = Logger.get('content:viewer-parts:router');

export default {
	mixins: [Mixins.BasePath],

	getInitialState  () {
		this.getRoutes().push(makeRoute('/:pageId(/)'));

		this.registerContentViewerSubRoute('/discussions(/*)', {discussions: true});
	},


	componentWillMount () {

		let {makeHref} = this;

		this.makeHref = link => {
			if (link === '' || link === '/') {
				link = '';
			}

			let {rootId} = this.props;
			let {pageId} = this.getPropsFromRoute();
			let isLinkForSubView = /^\//.test(link);

			if (pageId && (isLinkForSubView || link === '')) {
				if (pageId !== rootId) {
					link = `/${pageId}/${link}`;
				}
			}

			return makeHref.call(this, link)
				.replace(`/${rootId}/${rootId}/`, `/${rootId}/`)
				.replace(/\/\/$/, '');
		};

		this.navigate = (route, ...args) => {
			let target = this.makeHref(route);
			logger.debug('Input: %s\nResolved: %s\n\n', route, target);
			return this.getEnvironment().setPath(target, ...args);
		};

		this.makeHrefNewRoot = root => Path.resolve(makeHref.call(this, '/'), `../${root}/`) + '/';
		this.makeObjectHref = root => `${this.getBasePath()}object/${root}/`;
	},


	getDefaultProps  () {
		return { contextual: true };
	},


	getChildProps () {
		return {};
	},


	getPropsFromRoute  (props) {
		props = {contextual: true, ...(props || this.props)};

		let {match} = this.getRouterState(props);
		let p = match && {...((match.route || {}).props || {}), ...match.match};
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
		if (!this[ROUTES]) { this[ROUTES] = [makeRoute('/')]; }
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
