import React from 'react';

import Router from 'react-router-component';

import Media from './Media';
import Outline from './OutlineView';
import Overview from './Overview';

import {LESSONS} from '../Sections';

import ContentViewer from 'content/components/Viewer';

import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

const ROUTES = [
	{path: '/:outlineId/c/:rootId(/*)',		handler: ContentViewer,	slug: 'c'},
	{path: '/:outlineId/v(/*)',				handler: Media,			slug: 'v'},
	{path: '/:outlineId(/*)',				handler: Overview },
	{}//
];

export default React.createClass({
	displayName: 'Lessons',
	mixins: [ContextSender, NavigatableMixin],

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
				route.path ?
				<Router.Location {...route}
					contentPackage={course}
					course={course}
					/> :
				<Router.NotFound handler={Outline} item={course}/>
			));
	}
});
