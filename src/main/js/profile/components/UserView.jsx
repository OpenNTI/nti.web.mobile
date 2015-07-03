import React from 'react/addons';

import Router from 'react-router-component';

import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';

import Page from './Page';
import Activity from './Activity';
import Achievements from './Achievements';
import About from './About';

import Redirect from 'navigation/components/Redirect';

const ROUTES = [
	{path: '/activity(/*)',		handler: Activity },
	{path: '/achievements(/*)',	handler: Achievements },
	{path: '/about(/*)',		handler: About },
	{}//default
];

export default React.createClass({
	displayName: 'profile:View',
	mixins: [BasePathAware, ContextSender],

	propTypes: {
		user: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {};
	},

	getContext (/*props*/) {
		let path = this.getBasePath();
		return Promise.resolve([
			{
				href: path, label: 'Home'
			}, {
				href: location.href,
				label: 'Profile'
			}
		]);
	},


	render () {
		let {user} = this.props;

		if (!user) {
			return null;
		}

		return React.createElement(Router.Locations, {ref: 'router', contextual: true},
			...ROUTES.map(route=>
				route.path ?
				<Router.Location {...route}
					handler={Page} pageContent={route.handler}
					user={user}
					username={user.getID()}
					/> :
				<Router.NotFound handler={Redirect} location="/about/"/>
			));
	}
});
