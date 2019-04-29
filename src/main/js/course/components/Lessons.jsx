import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import Router from 'react-router-component';
import {Mixins} from '@nti/web-commons';

import ContextContributor from 'common/mixins/ContextContributor';

import {LESSONS} from '../Sections';

import Assignments from './Assignment';
import Content from './Content';
import External from './ExternalContent';
import Items from './items';
import Media from './Media';
import Outline from './OutlineView';
import Overview from './Overview';


const ROUTES = [
	{path: '/:outlineId/items/:rootId(/*)',                 handler: Items },
	{path: '/:outlineId/content/:rootId(/*)',		handler: Content },
	{path: '/:outlineId/assignment/:rootId(/*)',	handler: Assignments },
	{path: '/:outlineId/external-content/:relatedWorkRefId(/discussions)(/*)',	handler: External },
	{path: '/:outlineId/videos(/*)',				handler: Media },
	{path: '/:outlineId(/*)',						handler: Overview },
	{}//
];

export default createReactClass({
	displayName: 'Lessons',
	mixins: [ContextContributor, Mixins.NavigatableMixin],

	propTypes: {
		course: PropTypes.object.isRequired
	},

	getContext () {
		let {course} = this.props;
		let {title} = course.getPresentationProperties();

		let href = this.makeHref(LESSONS);
		let ntiid = course.getID();

		return Promise.resolve({
			label: title,
			ntiid,
			href
		});
	},

	render () {
		let {course} = this.props;

		return React.createElement(Router.Locations, {contextual: true},
			...ROUTES.map(route=>
				route.path ? (
					<Router.Location {...route}
						contentPackage={course}
						course={course}
					/>
				) : (
					<Router.NotFound handler={Outline} item={course}/>
				)
			));
	}
});
