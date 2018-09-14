import React from 'react';
import PropTypes from 'prop-types';
import {encodeForURI} from '@nti/lib-ntiids';

import Page from 'common/components/Page';

import NavigationTabs from './NavigationTabs';

export default class extends React.Component {
	static displayName = 'course:Page';

	static propTypes = {
		children: PropTypes.any,

		course: PropTypes.object.isRequired
	};

	static contextTypes = {
		router: PropTypes.object
	}


	static childContextTypes = {
		router: PropTypes.shape({
			getRouteFor: PropTypes.func
		})
	}


	getChildContext () {
		return {
			router: {
				...this.context.router,
				getRouteFor: (...args) => this.getRouteFor(...args)
			}
		};
	}


	getRouteFor (obj, context) {
		if (obj !== this.props.course) { return null; }

		const courseID = obj.getCourseID ? obj.getCourseID() : obj.NTIID;
		const base = `/mobile/course/${encodeForURI(courseID)}/`;

		let path = '';

		if (context === 'lessons') {
			path = 'lessons/';
		} else if (context === 'assignments') {
			path = 'assignments/';
		} else if (context === 'discussions') {
			path = 'discussions/';
		} else if (context === 'info') {
			path = 'info/';
		} else if (context === 'scorm') {
			path = 'scormcontent/';
		}

		return `${base}${path}`;
	}

	render () {
		const {children, course, ...otherProps} = this.props;

		return (
			<>
				<NavigationTabs course={course} exclude={['activity']}/>
				<Page {...otherProps} course={course} useCommonTabs>
					{React.Children.map(children, x => React.cloneElement(x))}
				</Page>
			</>
		);
	}
}
