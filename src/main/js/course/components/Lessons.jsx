import React from 'react';

import Router from 'react-router-component';

import Page from './Page';

import Media from './Media';
import Outline from './OutlineView';
import Overview from './Overview';

import ContentViewer from 'content/components/Viewer';

const ROUTES = [
	{path: '/:outlineId/c/:rootId(/*)',		handler: Page, pageContent: ContentViewer,	slug: 'c'},
	{path: '/:outlineId/v/:videoId(/*)',	handler: Page, pageContent: Media,			slug: 'v'},
	{path: '/:outlineId(/*)',				handler: Page, pageContent: Overview },
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

					sectionPathPrefix="../"
					contentPackage={course}
					contextProvider={contextProvider}
					course={course}
					/> :
				<Router.NotFound handler={Page} pageContent={Outline}
						sectionPathPrefix="../"
						contextProvider={contextProvider}
						item={course}
						/>
			));
	}
});
