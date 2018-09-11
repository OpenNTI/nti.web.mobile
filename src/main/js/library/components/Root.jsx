import path from 'path';

import React from 'react';
import PropTypes from 'prop-types';
import {View as SearchableLibrary} from '@nti/web-library';
import {isFlag} from '@nti/web-client';
import {encodeForURI} from '@nti/lib-ntiids';

import NavigationBar from 'navigation/components/Bar';

import Communities from './containers/Communities';
import Courses from './containers/Courses';
import Books from './containers/Books';
import Features from './containers/Features';
import Branding from './Branding';

export default class Root extends React.Component {
	static contextTypes = {
		router: PropTypes.object,
		basePath: PropTypes.string
	}


	static childContextTypes = {
		router: PropTypes.object
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
			route = path.join(basePath, 'content', obj.getID());
		} else if (/community/i.test(type)) {
			route = path.join(basePath, 'profile', obj.getID());
		}

		return route;
	}

	render () {
		return (
			<div>
				<NavigationBar>
					<Branding position="left"/>
				</NavigationBar>

				{isFlag('library-searchable') ? (
					<SearchableLibrary />
				) : (
					<>
						<Features/>

						<Communities/>

						<Courses/>

						<Courses admin/>

						<Books/>
					</>
				)}
			</div>
		);
	}
}
