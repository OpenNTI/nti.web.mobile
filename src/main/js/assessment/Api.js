import Logger from '@nti/util-logger';
import {Events} from '@nti/web-session';

import ReadOnlyStore from './Store';
import {getMainSubmittable, isAssignment, isSurvey} from './utils';

const logger = Logger.get('assessment:api');

const isHistoryItem = RegExp.prototype.test.bind(/AssignmentHistoryItem/i);

async function syncAssignmentWithResponse (assignment, resp) {
	try {
		const raw = await resp.MetadataAttemptItem.fetchLink('Assignment');

		return assignment.refresh(raw);
	} catch (e) {
		return assignment.refresh();
	}
}

export function loadPreviousState (assessment) {
	let main = getMainSubmittable(assessment);
	let load;

	if (main && main.loadPreviousSubmission) {
		load = main.loadPreviousSubmission();
	}

	return load || Promise.reject('Nothing to do');
}


export function saveProgress (assessment) {
	let main = getMainSubmittable(assessment);
	let progress = ReadOnlyStore.getSubmissionPreparedForPost(assessment);

	if (!main || !main.postSavePoint) {
		return Promise.reject('Nothing to do.');
	}

	return main.postSavePoint(progress, true);
}


export function submit (assessment) {
	let data = ReadOnlyStore.getSubmissionPreparedForPost(assessment);
	let main = getMainSubmittable(assessment);

	return data.submit()
		.then(response => {
			const fallback = () =>
				main.loadPreviousSubmission()
					.catch(e=> e.statusCode === 404
						? response
						: Promise.reject(e));

			if (isAssignment(assessment) && !data.isPracticeSubmission && !isHistoryItem(response.Class)) {
				const loadHistoryFromSubmission = response.getHistory
					? response.getHistory()
					: Promise.reject('No Link');

				return loadHistoryFromSubmission
					.catch(reason => reason === 'No Link'
						? fallback()
						: Promise.reject(reason));
			}
			else if (isSurvey(assessment)) {
				return main.refresh().then(() => response);
			}

			return response;
		})
		.then((resp) => {
			if (isAssignment(assessment)) {
				return syncAssignmentWithResponse(assessment, resp)
					.then(() => resp);
			}

			return resp;
		})
		.then((resp) => {
			if (isAssignment(assessment)) {
				Events.emit(Events.ASSIGNMENT_SUBMITTED, assessment);
			} else {
				Events.emit(Events.ASSESSMENT_SUBMITTED, assessment);
			}

			return resp;
		})
		.catch(reason => {
			//force this to always fulfill.
			logger.error('There was an error submitting the assessment: %o', reason.message || reason);
			return reason;
		});
}


export function submitFeedback (assessment, feedbackBody) {
	return ReadOnlyStore.getAssignmentFeedback(assessment)
		.then(feedback => {

			if (!feedback) {
				return Promise.reject('No Feedback object');
			}

			return feedback.addPost(feedbackBody)
				.then(()=>feedback.refresh());
		});
}


export function deleteFeedbackItem (assessment, feedbackItem) {
	return ReadOnlyStore.getAssignmentFeedback(assessment)
		.then(feedback => {

			if (!feedback) {
				return Promise.reject('No Feedback object');
			}

			return feedbackItem.delete()
				.then(()=>feedback.refresh());
		});
}

export function updateFeedbackItem (assessment, feedbackItem, feedbackBody) {
	return ReadOnlyStore.getAssignmentFeedback(assessment)
		.then(feedback => {

			if (!feedback) {
				return Promise.reject('No Feedback object');
			}

			return feedbackItem.editBody(feedbackBody)
				.then(()=>feedback.refresh());
		});
}
