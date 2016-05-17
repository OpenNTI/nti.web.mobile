import Assignment from './AssignmentPageGenerator';
import Assessment from './AssessmentPageGenerator';

export default {
	'application/vnd.nextthought.assessment.assignment': Assignment,
	'application/vnd.nextthought.assessment.timedassignment': Assignment,
	'application/vnd.nextthought.questionset': Assessment,
	'application/vnd.nextthought.naquestionset': Assessment,
	'application/vnd.nextthought.naquestionbank': Assessment
};
