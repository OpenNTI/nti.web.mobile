import {isFlag} from 'common/utils';

const SECTIONS = Object.assign({},
	isFlag('course-activity') ? {ACTIVITY: 'activity/'} : {},
	{
		// ACTIVITY: 'activity/',
		ASSIGNMENTS: 'assignments/',
		DISCUSSIONS: 'discussions/',
		LESSONS: 'lessons/',
		INFO: 'info',
		VIDEOS: 'videos/'
	});

export default SECTIONS;
