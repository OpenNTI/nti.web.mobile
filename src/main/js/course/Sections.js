import {isFlag, flagValue} from 'common/utils';

const SECTIONS = Object.assign({},
	isFlag('course-activity') ? {ACTIVITY: 'activity/'} : {},
	flagValue('course-assignments') !== false ? {ASSIGNMENTS: 'assignments/'} : {},
	{
		// ACTIVITY: 'activity/',
		// ASSIGNMENTS: 'assignments/',
		DISCUSSIONS: 'discussions/',
		LESSONS: 'lessons/',
		INFO: 'info',
		VIDEOS: 'videos/'
	});

export default SECTIONS;
