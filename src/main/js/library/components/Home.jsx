import './Home.scss';
import path from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import {decorate} from '@nti/lib-commons';
import {searchable, contextual} from '@nti/web-search';
import {View as SearchableLibrary} from '@nti/web-library';
import {encodeForURI} from '@nti/lib-ntiids';
import {Theme} from '@nti/web-commons';
import {Navigation} from '@nti/web-content';

import NavigationBar from 'navigation/components/Bar';


function getRememberedRoute (obj) {
	return Navigation.RememberedRoutes.getRememberedRoute([obj.getID ? obj.getID() : obj]);
}

function LibraryNavBar (props) {
	const theme = Theme.useThemeProperty('library.navigation');

	return (
		<NavigationBar {...props} theme={theme}>
			<div className="library-branding-container" position="left">
				<Theme.Asset className="library-branding-asset" property={theme.branding} />
			</div>
		</NavigationBar>
	);
}

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
				<LibraryNavBar supportsSearch className="searchable-library" searchTerm={searchTerm} />
				<SearchableLibrary />
			</>
		);
	}
}

export default decorate(Home, [
	searchable(),
	contextual('Home')
]);
