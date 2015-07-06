import React from 'react/addons';

import Router from 'react-router-component';

import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';

import Page from './GroupPageFrame';
import Activity from './Activity';
import Members from './Members';

import Redirect from 'navigation/components/Redirect';

const ROUTES = [
	{path: '/activity(/*)',	handler: Activity },
	{path: '/members(/*)',	handler: Members },
	{}//default
];

export default React.createClass({
	displayName: 'profile:View',
	mixins: [BasePathAware, ContextSender],

	propTypes: {
		entity: React.PropTypes.object.isRequired
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
		let {entity} = this.props;

		if (!entity) {
			return null;
		}

		return React.createElement(Router.Locations, {ref: 'router', contextual: true},
			...ROUTES.map(route=>
				route.path ?
				<Router.Location {...route} handler={Page} pageContent={route.handler} entity={entity} /> :
				<Router.NotFound handler={Redirect} location="/activity/"/>
			));
	}
});
