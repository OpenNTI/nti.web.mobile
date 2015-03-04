import React from 'react';

import Router from 'react-router-component';

import Page from './Page';

import Media from './Media';
import Outline from './OutlineView';
import Overview from './Overview';

import ContentViewer from 'content/components/Viewer';


export default React.createClass({
	displayName: 'Lessons',

	render () {
		let {course, contextProvider} = this.props;
		return (
				<Router.Locations contextual>
					<Router.Location path="/:outlineId/c/:rootId(/*)"
							handler={Page}
							pageContent={ContentViewer}
							contentPackage={course}
							contextProvider={contextProvider}
							slug="c"
							/>

					<Router.Location path="/:outlineId/v/:videoId(/*)"
							handler={Page}
							pageContent={Media}
							course={course}
							contextProvider={contextProvider}
							slug="v"
							/>

					<Router.Location path="/:outlineId(/*)"
							handler={Page}
							pageContent={Overview}
							course={course}
							contextProvider={contextProvider}
							/>

					<Router.NotFound handler={Page}
							pageContent={Outline}
							item={course}
							contextProvider={contextProvider}
							/>
				</Router.Locations>
		);
	}
});
