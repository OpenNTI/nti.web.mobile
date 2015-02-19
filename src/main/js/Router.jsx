import React from 'react';
import {Locations, Location, NotFound as Default} from 'react-router-component';

//Main View Handlers
import Contact from 'contact/components/View';
import Content from 'content/components/View';
import Course from 'course/components/View';
import Enrollment from 'enrollment/components/View';
import Home from 'home/components/View';
import Library from 'library/components/View';
import Login from 'login/components/View';
import Profile from 'profile/components/View';
import NotFound from 'notfound/components/View';

import BasePathAware from 'common/mixins/BasePath';

const HANDLER_BY_NAME = {
	Contact,
	Content,
	Course,
	Enrollment,
	Home,
	Library,
	Login,
	Profile
};

import RouteMap from './routes';

export default React.createClass({
	displayName: 'Router',
	mixins: [BasePathAware],


	onNavigation () {
		if (global.scrollTo) {
			global.scrollTo(0,0);
		}

		var action = this.props.onNavigation;
		if (action) {
			action();
		}

		// let {router} = this.refs;
		// debugger;
		// We can get the title and set it here.
	},


	render () {
		return React.createElement(Locations, {
			ref: 'router',
			path: this.props.path,
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

		routes.push(React.createElement(Default, {handler:NotFound}));

		return routes.filter(r=>r.props.handler);
	}

});
