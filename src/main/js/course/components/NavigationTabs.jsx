import React from 'react';
import PropTypes from 'prop-types';
import {Router, Route} from '@nti/web-routing';
import {Navigation} from '@nti/web-course';
import {encodeForURI} from '@nti/lib-ntiids';

class CourseNavigationTabs extends React.Component {
	static propTypes = {
		course: PropTypes.object.isRequired
	}

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
				baseroute: this.getBaseRoute(),
				getRouteFor: (...args) => this.getRouteFor(...args)
			}
		};
	}


	getBaseRoute () {
		const {course} = this.props;
		const courseID = course.getCourseID ? course.getCourseID() : course.NTIID;

		return `/mobile/course/${encodeForURI(courseID)}/`;
	}


	getRouteFor (obj, context) {
		if (obj !== this.props.course) { return null; }

		const base = this.getBaseRoute();

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
		} else if (context === 'videos') {
			path = 'videos/';
		}

		return `${base}${path}`;
	}


	render () {
		const {course} = this.props;

		return (
			<Navigation.Tabs course={course} />
		);
	}
}

export default Router.for([
	Route({path: '/', component: CourseNavigationTabs})
]);
