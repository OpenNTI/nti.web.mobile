import path from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import {searchable, contextual} from '@nti/web-search';
import {View as SearchableLibrary} from '@nti/web-library';
import {encodeForURI} from '@nti/lib-ntiids';
import {Navigation} from '@nti/web-content';

import NavigationBar from 'navigation/components/Bar';

import Branding from './Branding';

function getRememberedRoute (obj) {
	return Navigation.RememberedRoutes.getRememberedRoute([obj.getID ? obj.getID() : obj]);
}

export default
@searchable()
@contextual('Home')
class Home extends React.Component {
	static contextTypes = {
		router: PropTypes.object,
		basePath: PropTypes.string
	}


	static childContextTypes = {
		router: PropTypes.object
	}

	static propTypes = {
		searchTerm: PropTypes.string
	}


	getChildContext () {
		const {router: nav} = this.context;

		return {
			router: {
				...(nav || {}),
				baseroute: nav && nav.makeHref(''),
				getRouteFor: this.getRouteFor,
			}
		};
	}


	getRouteFor = (obj, context) => {
		const {context: {basePath}} = this;
		const getEncodedIDCourse = o => encodeForURI(o.getLinkProperty('CourseInstance', 'ntiid'));
		const {MimeType: type} = obj || {};

		let route = '';

		if (/course(.*)enrollment/i.test(type) || /courseinstanceadministrativerole/i.test(type)) {
			route = path.join(basePath, 'course', getEncodedIDCourse(obj));
		} else if (/contentpackagebundle/i.test(type)) {
			route = getRememberedRoute(obj) || path.join(basePath, 'content', encodeForURI(obj.getID()));
		} else if (/community/i.test(type)) {
			route = path.join(basePath, 'community', encodeURIComponent(obj.Username));
		}

		return route;
	}


	render () {
		const {searchTerm} = this.props;

		return (
			<>
				<NavigationBar supportsSearch className="searchable-library" searchTerm={searchTerm}>
					<Branding position="left"/>
				</NavigationBar>

				<SearchableLibrary />
			</>
		);
	}
}
