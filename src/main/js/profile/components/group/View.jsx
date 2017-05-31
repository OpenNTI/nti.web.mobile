import PropTypes from 'prop-types';
import React from 'react';

import createReactClass from 'create-react-class';

import Router from 'react-router-component';

import {Mixins} from 'nti-web-commons';
import ContextSender from 'common/mixins/ContextSender';

import Page from './PageFrame';
import Activity from './Activity';
import Members from '../Members'; //This seems backwards. The Group-specific Members view should be in the folder and wrap the generic Members view.
import ForumView from '../ForumView';

import Redirect from 'navigation/components/Redirect';
import {encodeForURI} from 'nti-lib-ntiids';
import {join} from 'path';

const ROUTES = [
	{path: '/activity/discussions/:forumId(/*)', handler: ForumView },
	{path: '/activity(/*)',	handler: Activity },
	{path: '/members(/*)',	handler: Members },
	{}//default
];

export default createReactClass({
	displayName: 'Group:View',
	mixins: [Mixins.BasePath, ContextSender],

	propTypes: {
		entity: PropTypes.object.isRequired
	},

	getInitialState () {
		return {};
	},

	getContext () {
		let path = this.getBasePath();
		let href = join(path, 'profile', encodeForURI(this.props.entity.getID()), '/');
		return Promise.resolve([
			{
				href: path, label: 'Home'
			}, {
				href,
				label: 'Profile'
			}
		]);
	},


	render () {
		let {entity} = this.props;

		if (!entity) {
			return null;
		}

		return React.createElement(Router.Locations, {ref: 'router', contextual: true, childProps: {entity}},
			...ROUTES.map(route=>
				route.path ?
				<Router.Location {...route} handler={Page} pageContent={route.handler} entity={entity} /> :
				<Router.NotFound handler={Redirect} location="/activity/"/>
			));
	}
});
