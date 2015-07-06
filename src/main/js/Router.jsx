import React from 'react';

import {
	Locations,
	Location,
	NotFound,
	createURLPatternCompiler,
	setCreateURLPatternCompilerFactory
} from 'react-router-component';

const URLPatternCompilerFactory = createURLPatternCompiler;
setCreateURLPatternCompilerFactory(() => {
	let compiler = URLPatternCompilerFactory();
	compiler.segmentValueCharset = 'a-zA-Z0-9-_ %.:()';
	return compiler;
});

//Main View Handlers
import Catalog from 'catalog/components/View';
import Contact from 'contact/components/View';
import Content from 'content/components/View';
import Course from 'course/components/View';
import Enrollment from 'enrollment/components/View';
import Home from 'home/components/View';
import Library from 'library/components/View';
import Login from 'login/components/View';
import Profile from 'profile/components/View';
import NotFoundPage from 'notfound/components/View';
import ObjectResolver from 'object-resolver/components/View';

import BasePathAware from 'common/mixins/BasePath';

const HANDLER_BY_NAME = {
	Catalog,
	Contact,
	Content,
	Course,
	Enrollment,
	Home,
	Library,
	Login,
	Profile,
	Object: ObjectResolver
};

const sendGAEvent = 'Router:sendGAEvent';

import RouteMap from './routes';

export default React.createClass({
	displayName: 'Router',
	mixins: [BasePathAware],


	onBeforeNavigation () {
		let action = this.props.onBeforeNavigation;
		if (action) {
			action();
		}
	},

	[sendGAEvent]() {
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

		this[sendGAEvent]();

		// let {router} = this.refs;
		// debugger;
		// We can get the title and set it here.
	},


	render () {
		return React.createElement(Locations, {
			ref: 'router',
			path: this.props.path,
			onBeforeNavigation: this.onBeforeNavigation,
			onNavigation: this.onNavigation}, ...this.getRoutes());
	},


	getRoutes () {
		function lookupHandler(route) {
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
				path: basePath + r.path,
				handler: lookupHandler(r)
			}));

		routes.push(React.createElement(NotFound, {handler: NotFoundPage}));

		return routes.filter(r=>r.props.handler);
	}

});
