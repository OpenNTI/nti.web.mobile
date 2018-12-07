import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {Prompt, Mixins} from '@nti/web-commons';
import {getHistory, createPath} from '@nti/web-routing';
import {
	environment,
	Locations,
	Location,
	NotFound
} from 'react-router-component';
import Logger from '@nti/util-logger';

//Main View Handlers
import Webinar from 'calendar/components/Webinar';
import Event from 'calendar/components/Event';
import Calendar from 'calendar';
import Catalog from 'catalog/components/ViewLoader';
import ContactUs from 'contact-us/components/View';
import Contacts from 'contacts/components/ViewLoader';
import Content from 'content/components/ViewLoader';
import Course from 'course/components/ViewLoader';
import Enrollment from 'enrollment/components/ViewLoader';
import Home from 'home/components/View';
import Library from 'library/components/ViewLoader';
import Login from 'login/components/ViewLoader';
import Profile from 'profile/components/ViewLoader';
import NotFoundPage from 'notfound/components/View';
import ObjectResolver from 'object-resolver/components/View';
import Welcome from 'login/prompts/View';
import NavStore from 'navigation/Store';

import RouteMap from './routes';

const ENVIRONMENT = environment.defaultEnvironment;

const logger = Logger.get('root:router');

const HANDLER_BY_NAME = {
	Calendar,
	Catalog,
	ContactUs,
	Contacts,
	Content,
	Course,
	Enrollment,
	Home,
	Library,
	Login,
	Profile,
	Object: ObjectResolver,
	Welcome,
	Webinar,
	Event
};

const SendGAEvent = 'Router:SendGAEvent';
const SetPath = '_original:SetPath';

const routerHistory = getHistory();

export default createReactClass({
	displayName: 'Router',
	mixins: [Mixins.BasePath],

	propTypes: {
		onBeforeNavigation: PropTypes.func,
		onNavigation: PropTypes.func,
		path: PropTypes.string
	},

	componentWillUnmount () {
		//reset back to normal.
		delete ENVIRONMENT.setPath;
		delete ENVIRONMENT[SetPath];

		if (this.removeRouterHistoryListener) {
			this.removeRouterHistoryListener();
		}
	},

	componentDidMount () {
		let {setPath} = ENVIRONMENT;

		Object.assign(ENVIRONMENT, {
			[SetPath]: setPath,
			setPath: (...args) => {
				let [path, options = {}] = args;
				let continueSetPath = () => {
					ENVIRONMENT[SetPath](...args);

					if (routerHistory && routerHistory.location && routerHistory.location.pathname !== path) {
						routerHistory.replace(path);
					}
				};

				if (options.isPopState || !this.maybeBlockNavigation(continueSetPath)) {
					continueSetPath();
				}
			}
		});

		this.removeRouterHistoryListener = routerHistory.listen((...args) => this.onRouterHistoryChange(...args));
	},


	onRouterHistoryChange (location) {
		const currentPath = ENVIRONMENT.path;
		const newPath = createPath(location);

		if (currentPath !== newPath) {
			ENVIRONMENT.setPath(newPath, {isPopState: false, replace: true});
		}
	},


	maybeBlockNavigation (cb) {
		if (NavStore.getGuardMessage) {

			Prompt.areYouSure(NavStore.getGuardMessage(), 'Attention!', {
				confirmButtonLabel: 'Leave',
				cancelButtonLabel: 'Stay'})
				.then(cb, ()=> {});

			return true;
		}
	},


	onBeforeNavigation () {
		let action = this.props.onBeforeNavigation;
		if (action) {
			action();
		}
	},

	[SendGAEvent] () {
		const {ga, location} = global;

		if (!ga) {
			logger.warn('Router requires ga to be available in global scope. Aborting attempt to send google analytics navigation event');
			return;
		}

		const {href, origin} = location;

		ga('set', 'page', href.replace(origin, ''));
		ga('send', 'pageview');
	},

	onNavigation () {
		if (global.scrollTo) {
			global.scrollTo(0, 0);
		}

		let action = this.props.onNavigation;
		if (action) {
			action();
		}

		this[SendGAEvent]();


		// debugger;
		// We can get the title and set it here.
	},


	render () {
		return React.createElement(Locations, {
			ref: 'router',
			path: this.props.path,
			onBeforeNavigation: this.onBeforeNavigation,
			onNavigation: this.onNavigation,
			urlPatternOptions: {segmentValueCharset: 'a-zA-Z0-9-_ %.:(),'}
		},
		...this.getRoutes());
	},


	getRoutes () {
		function lookupHandler (route) {
			let view = HANDLER_BY_NAME[route.handler];
			if (!view) {
				route.disabled = true;
				logger.error('Handler not defined for %s: %o', route.path, route);
			}
			return view;
		}

		let basePath = this.getBasePath();
		let routes = RouteMap.filter(x=>!x.disabled).map(r=>
			React.createElement(Location, {
				path: (basePath + r.path).replace(/\/\//g, '/'),
				handler: lookupHandler(r)
			}));

		routes.push(React.createElement(NotFound, {handler: NotFoundPage}));

		return routes.filter(r=>r.props.handler);
	}

});
