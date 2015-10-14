import React from 'react';

import Router from 'react-router-component';

import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';

import Page from './PageFrame';
import Info from './Info';

import Activity from '../Activity';
import Members from './Members';
import {profileHref} from '../../mixins/ProfileLink';
import ForumView from '../ForumView';

import Redirect from 'navigation/components/Redirect';

const ROUTES = [
	{path: '/activity/discussions/:forumId(/*)', handler: ForumView },
	{path: '/activity(/:selected)(/*)', handler: Activity },
	{path: '/members(/*)', handler: Members },

	{path: '/info/members(/*)', handler: Info, show: 'members' },
	{path: '/info/faculty(/*)', handler: Info, show: 'faculty' },
	{path: '/info/pyk(/*)', handler: Info, show: 'pyk' },
	{path: '/info(/*)', handler: Info },
	{}//default
];

export default React.createClass({
	displayName: 'Community:View',
	mixins: [BasePathAware, ContextSender],

	propTypes: {
		entity: React.PropTypes.object.isRequired
	},

	getInitialState () {
		return {};
	},

	getContext () {
		let path = this.getBasePath();
		let {entity} = this.props;
		return Promise.resolve([
			{
				href: path, label: 'Home'
			}, {
				href: path + profileHref(entity),
				label: 'Community'
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
