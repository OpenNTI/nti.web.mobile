import React from 'react';

import Router from 'react-router-component';

import Media from './Media';
import Outline from './OutlineView';
import Overview from './Overview';

import ContentViewer from 'content/components/Viewer';

const ROUTES = [
	{path: '/:outlineId/c/:rootId(/*)',		handler: ContentViewer,	slug: 'c'},
	{path: '/:outlineId/v/:videoId(/*)',	handler: Media,			slug: 'v'},
	{path: '/:outlineId(/*)',				handler: Overview },
	{}//
];

export default React.createClass({
	displayName: 'Lessons',

	render () {
		let {course, contextProvider} = this.props;

		return React.createElement(Router.Locations, {contextual: true},
			...ROUTES.map(route=>
				route.path ?
				<Router.Location {...route}

					contentPackage={course}
					contextProvider={contextProvider}
					course={course}
					/> :
				<Router.NotFound handler={Outline}
						contextProvider={contextProvider}
						item={course}
						/>
			));
	}
});
