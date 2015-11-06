import React from 'react';

import Store from 'assessment/Store';
import {areAssessmentsSupported, isAssignment} from 'assessment/utils';
import FeedbackWidget from 'assessment/components/Feedback';
import SetHeaderWidget from 'assessment/components/Header';
import SetSubmissionWidget from 'assessment/components/Submission';

export {isAssignment};

export default {

	renderAssessmentHeader () {
		let {page} = this.state;
		let quiz = page && page.getSubmittableAssessment();
		if (!page || !quiz) {
			return null;
		}

		return React.createElement(SetHeaderWidget, {
			assessment: quiz,
			page
		});
	},


	renderAssessmentFeedback () {
		let {page} = this.state;
		let quiz = page && page.getSubmittableAssessment();
		if (!page || !quiz) {
			return null;
		}

		return React.createElement(FeedbackWidget, {
			assessment: quiz,
			page
		});
	},


	renderAssessmentSubmission () {
		let {page} = this.state;
		let quiz = page && page.getSubmittableAssessment();
		if (!page || !quiz || quiz.IsTimedAssignment || !areAssessmentsSupported()) {
			return null;
		}

		return React.createElement(SetSubmissionWidget, {
			assessment: quiz,
			page
		});
	},


	componentWillUpdate (nextProps, nextState) {
		let prevPage = this.state.page;
		let nextPage = nextState && nextState.page;

		let prev = prevPage && prevPage.getSubmittableAssessment();
		let next = nextPage && nextPage.getSubmittableAssessment();


		if ((next && next.getID()) !== (prev && prev.getID())) {
			let {contentPackage} = nextProps;
			//To be administrative, the content package must be decendent to an
			//CourseInstanceAdministrativeRole, AND the assessment has to be an
			//Assignment. (Self-Assessments are presently defined as not being
			// administered.)
			let admin = Boolean(contentPackage &&
						contentPackage.parent('isAdministrative') &&
						next && isAssignment(next));

			Store.teardownAssessment(prev);
			Store.setupAssessment(next, true, admin);
		}
	}


};
