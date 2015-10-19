import React from 'react';
import Router from 'react-router-component';
import BlogEntry from './BlogEntryDetail';
import NotFoundPage from 'notfound/components/View';

const ROUTES = [
	{path: '/(:id)(/*)', handler: BlogEntry },
	{}//default
];

export default React.createClass({
	displayName: 'Thoughts',

	render () {
		return React.createElement(Router.Locations, {ref: 'router', contextual: true},
			...ROUTES.map(route=>
				route.path ?
				<Router.Location {...route}
					handler={route.handler}
					{...this.props}
					/> :
				<Router.NotFound handler={NotFoundPage} />
			));
	}
});
