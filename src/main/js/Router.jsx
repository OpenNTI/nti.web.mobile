import React from 'react';

import {
	environment,
	Locations,
	Location,
	NotFound
} from 'react-router-component';

const ENVIRONMENT = environment.defaultEnvironment;

//Main View Handlers
import Catalog from 'catalog/components/View.async';
import Contacts from 'contacts/components/View';
import Content from 'content/components/View';
import Course from 'course/components/View';
import Enrollment from 'enrollment/components/View';
import Home from 'home/components/View';
import Library from 'library/components/View';
import Login from 'login/components/View';
import Profile from 'profile/components/View';
import NotFoundPage from 'notfound/components/View';
import ObjectResolver from 'object-resolver/components/View';
import Terms from 'terms/components/View';


import NavStore from 'navigation/Store';
import {areYouSure} from 'prompts';

import BasePathAware from 'common/mixins/BasePath';

const HANDLER_BY_NAME = {
	Catalog,
	Contacts,
	Content,
	Course,
	Enrollment,
	Home,
	Library,
	Login,
	Profile,
	Object: ObjectResolver,
	Terms
};

const SendGAEvent = 'Router:SendGAEvent';
const SetPath = '_original:SetPath';

import RouteMap from './routes';

export default React.createClass({
	displayName: 'Router',
	mixins: [BasePathAware],

	propTypes: {
		onBeforeNavigation: React.PropTypes.func,
		onNavigation: React.PropTypes.func,
		path: React.PropTypes.string
	},

	componentWillUnmount () {
		//reset back to normal.
		delete ENVIRONMENT.setPath;
		delete ENVIRONMENT[SetPath];
	},

	componentDidMount () {
		let {setPath} = ENVIRONMENT;

		Object.assign(ENVIRONMENT, {
			[SetPath]: setPath,
			setPath: (...args) => {
				let [, options = {}] = args;
				let continueSetPath = () => ENVIRONMENT[SetPath](...args);

				if (options.isPopState || !this.maybeBlockNavigation(continueSetPath)) {
					continueSetPath();
				}
			}
		});
	},


	maybeBlockNavigation (cb) {
		if (NavStore.getGuardMessage) {

			areYouSure(NavStore.getGuardMessage(), 'Attention!', {
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
		if (!global.ga) {
			console.warn('Router requires ga to be available in global scope. Aborting attempt to send google analytics navigation event');
			return;
		}
		global.ga('set', 'page', global.location.pathname);
		global.ga('send', 'pageview');
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

		// let {router} = this.refs;
		// debugger;
		// We can get the title and set it here.
	},


	render () {
		return React.createElement(Locations, {
			ref: 'router',
			path: this.props.path,
			onBeforeNavigation: this.onBeforeNavigation,
			onNavigation: this.onNavigation,
			urlPatternOptions: {segmentValueCharset: 'a-zA-Z0-9-_ %.:()'}
		},
		...this.getRoutes());
	},


	getRoutes () {
		function lookupHandler (route) {
			let view = HANDLER_BY_NAME[route.handler];
			if (!view) {
				route.disabled = true;
				console.error('Handler not defined for %s: %o', route.path, route);
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
