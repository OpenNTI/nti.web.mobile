import React from 'react';
import PropTypes from 'prop-types';
import {
	environment,
	Locations,
	Location,
	NotFound,
} from 'react-router-component';

import { Prompt } from '@nti/web-commons';
import { encodeForURI } from '@nti/lib-ntiids';
import {
	createPath,
	getHistory,
	BasePathContext,
	BrowserRouter,
	Router,
} from '@nti/web-routing';
import Logger from '@nti/util-logger';
//Main View Handlers
import Calendar from 'internal/calendar';
import Catalog from 'internal/catalog/components/ViewLoader';
import Community from 'internal/community/components/ViewLoader';
import ContactUs from 'internal/contact-us/components/View';
import Contacts from 'internal/contacts/components/ViewLoader';
import Content from 'internal/content/components/ViewLoader';
import Course from 'internal/course/components/ViewLoader';
import Enrollment from 'internal/enrollment/components/ViewLoader';
import Home from 'internal/home/components/View';
import Library from 'internal/library/components/ViewLoader';
import Login from 'internal/login/components/ViewLoader';
import Profile from 'internal/profile/components/ViewLoader';
import NotFoundPage from 'internal/notfound/components/View';
import ObjectResolver from 'internal/object-resolver/components/View';
import Welcome from 'internal/login/prompts/View';
import NavStore from 'internal/navigation/Store';

import { profileHref } from '../profile/mixins/ProfileLink';

import RouteMap from './routes';

const ENVIRONMENT = environment.defaultEnvironment;

const logger = Logger.get('root:router');

const HANDLER_BY_NAME = {
	Calendar,
	Catalog,
	Community,
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
};

const SendGAEvent = 'Router:SendGAEvent';
const SetPath = '_original:SetPath';

const routerHistory = getHistory();

Router.setGlobalGetRouteFor(obj => {
	if (obj.isCommunity && obj.isCourseCommunity) {
		return `/mobile/course/${encodeForURI(obj.courseId)}/community/`;
	}

	if (obj.isUser || obj.isCommunity || obj.isGroup) {
		return `/mobile/${profileHref(obj)}`;
	}
});

export default class MobileRouter extends React.Component {
	static propTypes = {
		onBeforeNavigation: PropTypes.func,
		onNavigation: PropTypes.func,
		path: PropTypes.string,
	};

	componentWillUnmount() {
		//reset back to normal.
		delete ENVIRONMENT.setPath;
		delete ENVIRONMENT[SetPath];

		if (this.removeRouterHistoryListener) {
			this.removeRouterHistoryListener();
		}
	}

	componentDidMount() {
		let { setPath } = ENVIRONMENT;

		Object.assign(ENVIRONMENT, {
			[SetPath]: setPath,
			setPath: (...args) => {
				let [path, options = {}] = args;
				let continueSetPath = () => {
					ENVIRONMENT[SetPath](...args);

					if (
						routerHistory &&
						routerHistory.location &&
						routerHistory.location.pathname !== path
					) {
						routerHistory.replace(path);
					}
				};

				if (
					options.isPopState ||
					!this.maybeBlockNavigation(continueSetPath)
				) {
					continueSetPath();
				}
			},
		});

		this.removeRouterHistoryListener = routerHistory.listen((...args) =>
			this.onRouterHistoryChange(...args)
		);
	}

	static contextType = BasePathContext;

	getBasePath() {
		return this.context;
	}

	onRouterHistoryChange(location) {
		const currentPath = ENVIRONMENT.path;
		const newPath = createPath(location);

		if (currentPath !== newPath) {
			ENVIRONMENT.setPath(newPath, { isPopState: false, replace: true });
		}
	}

	maybeBlockNavigation(cb) {
		if (NavStore.getGuardMessage) {
			Prompt.areYouSure(NavStore.getGuardMessage(), 'Attention!', {
				confirmButtonLabel: 'Leave',
				cancelButtonLabel: 'Stay',
			}).then(cb, () => {});

			return true;
		}
	}

	onBeforeNavigation = () => {
		this.props.onBeforeNavigation?.();
	};

	[SendGAEvent]() {
		const { ga, location } = global;

		if (!ga) {
			// logger.warn('Router requires ga to be available in global scope. Aborting attempt to send google analytics navigation event');
			return;
		}

		const { href, origin } = location;

		ga('set', 'page', href.replace(origin, ''));
		ga('send', 'pageview');
	}

	onNavigation = () => {
		if (global.scrollTo) {
			global.scrollTo(0, 0);
		}

		this.props.onNavigation?.();

		this[SendGAEvent]();

		// We can get the title and set it here.
	};

	render() {
		return (
			<BrowserRouter>
				{React.createElement(
					Locations,
					{
						ref: 'router',
						path: this.props.path,
						onBeforeNavigation: this.onBeforeNavigation,
						onNavigation: this.onNavigation,
						urlPatternOptions: {
							segmentValueCharset: "a-zA-Z0-9-_ %.:(),'",
						},
					},
					...this.getRoutes()
				)}
			</BrowserRouter>
		);
	}

	getRoutes() {
		function lookupHandler(route) {
			let view = HANDLER_BY_NAME[route.handler];
			if (!view) {
				route.disabled = true;
				logger.error(
					'Handler not defined for %s: %o',
					route.path,
					route
				);
			}
			return view;
		}

		let basePath = this.getBasePath();
		let routes = RouteMap.filter(x => !x.disabled).map(r =>
			React.createElement(Location, {
				path: (basePath + r.path).replace(/\/\//g, '/'),
				handler: lookupHandler(r),
			})
		);

		routes.push(React.createElement(NotFound, { handler: NotFoundPage }));

		return routes.filter(r => r.props.handler);
	}
}
