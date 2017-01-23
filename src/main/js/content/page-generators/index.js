import Assignment from './AssignmentPageGenerator';
import Assessment from './AssessmentPageGenerator';
import DiscussionAssignment from './DiscussionAssignmentPageGenerator';

export default {
	'application/vnd.nextthought.assessment.assignment': Assignment,
	'application/vnd.nextthought.assessment.timedassignment': Assignment,
	'application/vnd.nextthought.assessment.discussionassignment': DiscussionAssignment,
	'application/vnd.nextthought.questionset': Assessment,
	'application/vnd.nextthought.naquestionset': Assessment,
	'application/vnd.nextthought.naquestionbank': Assessment
};
