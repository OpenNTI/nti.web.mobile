import React from 'react';

import Router from 'react-router-component';

import Content from './Content';
import Media from './Media';
import Outline from './OutlineView';
import Overview from './Overview';

import {LESSONS} from '../Sections';

import ContextContributor from 'common/mixins/ContextContributor';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

const ROUTES = [
	{path: '/:outlineId/c/:rootId(/*)',		handler: Content },
	{path: '/:outlineId/v(/*)',				handler: Media,			slug: 'v'},
	{path: '/:outlineId(/*)',				handler: Overview },
	{}//
];

export default React.createClass({
	displayName: 'Lessons',
	mixins: [ContextContributor, NavigatableMixin],

	propTypes: {
		course: React.PropTypes.object.isRequired
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
				route.path ?
				<Router.Location {...route}
					contentPackage={course}
					course={course}
					/> :
				<Router.NotFound handler={Outline} item={course}/>
			));
	}
});
