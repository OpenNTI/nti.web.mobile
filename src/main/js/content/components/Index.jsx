import React from 'react';

import Router from 'react-router-component';

import ContextContributor from 'common/mixins/ContextContributor';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import Content from './Viewer';
import TableOfContents from './TableOfContentsView';

const ROUTES = [
	{path: '/:rootId(/*)',	handler: Content },
	{path: '(/*)',			handler: TableOfContents }
];

export default React.createClass({
	displayName: 'Content:OutlineView',
	mixins: [ContextContributor, NavigatableMixin],

	propTypes: {
		contentPackage: React.PropTypes.object.isRequired
	},


	getContext () {
		let {contentPackage} = this.props;
		let {title} = contentPackage;

		let href = this.makeHref('o/');
		let ntiid = contentPackage.getID();

		return Promise.resolve({
			label: title,
			ntiid,
			href
		});
	},


	render () {
		let {contentPackage} = this.props;

		return React.createElement(Router.Locations, {contextual: true},
			...ROUTES.map(route=>
				<Router.Location {...route}
					contentPackage={contentPackage}
					/>
			));
	}
});
