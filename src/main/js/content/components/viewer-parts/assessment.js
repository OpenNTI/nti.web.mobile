import React from 'react';

import Store from 'assessment/Store';
import {areAssessmentsSupported} from 'assessment/Utils';
import FeedbackWidget from 'assessment/components/Feedback';
import SetHeaderWidget from 'assessment/components/Header';
import SetSubmissionWidget from 'assessment/components/Submission';


export default {

	renderAssessmentHeader () {
		var page = this.state.page;
		var quiz = page && page.getSubmittableAssessment();
		if (!page || !quiz) {
			return null;
		}

		return React.createElement(SetHeaderWidget, {
			assessment: quiz,
			page: page
		});
	},


	renderAssessmentFeedback () {
		var page = this.state.page;
		var quiz = page && page.getSubmittableAssessment();
		if (!page || !quiz) {
			return null;
		}

		return React.createElement(FeedbackWidget, {
			assessment: quiz,
			page: page
		});
	},


	renderAssessmentSubmission () {
		var page = this.state.page;
		var quiz = page && page.getSubmittableAssessment();
		if (!page || !quiz || quiz.IsTimedAssignment || !areAssessmentsSupported()) {
			return null;
		}

		return (
			React.createElement('div', {className: 'fixed-footer'},
				React.createElement('div', {className: 'the-fixed'},
					React.createElement(SetSubmissionWidget, {
						assessment: quiz,
						page: page
					})
				)
			)
		);
	},


	componentWillUpdate (_, nextState) {
		var prevPage = this.state.page;
		var nextPage = nextState && nextState.page;

		var prev = prevPage && prevPage.getSubmittableAssessment();
		var next = nextPage && nextPage.getSubmittableAssessment();

		if ((next && next.getID()) !== (prev && prev.getID())) {
			Store.teardownAssessment(prev);
			Store.setupAssessment(next, true);
		}
	}


};
