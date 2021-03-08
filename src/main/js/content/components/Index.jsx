import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import Router from 'react-router-component';

import { Mixins } from '@nti/web-commons';
import ContextContributor from 'internal/common/mixins/ContextContributor';

import Content from './Viewer';
import TableOfContents from './TableOfContentsView';

const ROUTES = [
	{ path: '/:rootId(/*)', handler: Content },
	{ path: '(/*)', handler: TableOfContents },
];

export default createReactClass({
	displayName: 'Content:OutlineView',
	mixins: [ContextContributor, Mixins.NavigatableMixin],

	propTypes: {
		contentPackage: PropTypes.object.isRequired,
	},

	getContext() {
		let { contentPackage } = this.props;
		// let {title} = contentPackage;

		let href = this.makeHref('o/');
		let ntiid = contentPackage.getID();

		return Promise.resolve({
			// label: title + ' Contents',
			label: 'Contents',
			ntiid,
			href,
		});
	},

	render() {
		let { contentPackage } = this.props;

		return React.createElement(
			Router.Locations,
			{ contextual: true },
			...ROUTES.map(route => (
				<Router.Location
					key={route.path}
					{...route}
					contentPackage={contentPackage}
				/>
			))
		);
	},
});
