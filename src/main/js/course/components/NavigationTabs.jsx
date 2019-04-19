import React from 'react';
import PropTypes from 'prop-types';
import {Router, Route} from '@nti/web-routing';
import {Navigation} from '@nti/web-course';
import {encodeForURI} from '@nti/lib-ntiids';
import Storage from '@nti/web-storage';
import {getAppUsername} from '@nti/web-client';

const seen = 'seen';

function getStorageKey () {
	return `nti-course-tabs-seen-for-${getAppUsername()}`;
}

function hasBeenSeen () {
	return Storage.getItem(getStorageKey()) !== seen;
}

function setSeen () {
	Storage.setItem(getStorageKey(), seen);
}

const CONTEXT_PATHS = {
	lessons: 'lessons',
	assignments: 'assignments',
	discussions: 'discussions',
	info: 'info',
	videos: 'videos',
	content: 'content',
	
	scorm: 'scormcontent',
};

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


	componentDidMount () {
		setTimeout(() => {
			setSeen();
		}, 1000);
	}


	getRouteFor (obj, context) {
		if (obj !== this.props.course) { return null; }

		const base = this.getBaseRoute();

		const path = CONTEXT_PATHS[context] || '';

		return `${base}${path}/`;
	}


	render () {
		const {course} = this.props;

		return (
			<Navigation.Tabs
				course={course}
				exclude={['activity']}
				expandTabs={hasBeenSeen()}
			/>
		);
	}
}

export default Router.for([
	Route({path: '/', component: CourseNavigationTabs})
]);
