import ReadOnlyStore from './Store';
import {getMainSubmittable, isAssignment} from './Utils';

var isHistoryItem = RegExp.prototype.test.bind(/AssignmentHistoryItem/i);

export function loadPreviousState (assessment) {
	var main = getMainSubmittable(assessment);
	var load;

	if (main && main.loadPreviousSubmission) {
		load = main.loadPreviousSubmission();
	}

	return load || Promise.reject('Nothing to do');
}


export function saveProgress (assessment) {
	var main = getMainSubmittable(assessment);
	var progress = ReadOnlyStore.getSubmissionPreparedForPost(assessment);

	if (!main || !main.postSavePoint) {
		return Promise.reject('Nothing to do.');
	}

	return main.postSavePoint(progress);
}


export function submit (assessment) {
	var data = ReadOnlyStore.getSubmissionPreparedForPost(assessment);
	var main = getMainSubmittable(assessment);

	return data.submit()
		.then(response => {
			if (isAssignment(assessment) && !isHistoryItem(response.Class)) {
				return main.loadPreviousSubmission();
			}
			return response;
		})
		.catch(reason => {
			//force this to always fulfill.
			console.error('There was an error submitting the assessment: %o', reason.message || reason);
			return reason;
		});
}


export function submitFeedback (assessment, feedbackBody) {
	var feedback = ReadOnlyStore.getAssignmentFeedback(assessment);

	if (!feedback) {
		return Promise.reject('No Feedback object');
	}

	return feedback.addPost(feedbackBody)
		.then(()=>feedback.refresh());
}


export function deleteFeedbackItem (assessment, feedbackItem) {
	var feedback = ReadOnlyStore.getAssignmentFeedback(assessment);

	if (!feedback) {
		return Promise.reject('No Feedback object');
	}

	return feedbackItem.delete()
		.then(()=>feedback.refresh());
}

export function updateFeedbackItem (assessment, feedbackItem, feedbackBody) {
	var feedback = ReadOnlyStore.getAssignmentFeedback(assessment);

	if (!feedback) {
		return Promise.reject('No Feedback object');
	}

	return feedbackItem.editBody(feedbackBody)
		.then(()=>feedback.refresh());
}
