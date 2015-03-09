import React from 'react';

import Store from 'assessment/Store';
import {areAssessmentsSupported} from 'assessment/Utils';
import FeedbackWidget from 'assessment/components/Feedback';
import SetHeaderWidget from 'assessment/components/Header';
import SetSubmissionWidget from 'assessment/components/Submission';


export default {

	renderAssessmentHeader () {
		let {page} = this.state;
		let quiz = page && page.getSubmittableAssessment();
		if (!page || !quiz) {
			return null;
		}

		return React.createElement(SetHeaderWidget, {
			assessment: quiz,
			page: page
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
			page: page
		});
	},


	renderAssessmentSubmission () {
		let {page} = this.state;
		let {contentPackage} = this.props;
		let quiz = page && page.getSubmittableAssessment();
		if (!page || !quiz || quiz.IsTimedAssignment || !areAssessmentsSupported()) {
			return null;
		}

		return (
			React.createElement('div', {className: 'fixed-footer'},
				React.createElement('div', {className: 'the-fixed'},
					React.createElement(SetSubmissionWidget, {
						assessment: quiz,
						contentPackage: contentPackage,
						page: page
					})
				)
			)
		);
	},


	componentWillUpdate (_, nextState) {
		let prevPage = this.state.page;
		let nextPage = nextState && nextState.page;

		let prev = prevPage && prevPage.getSubmittableAssessment();
		let next = nextPage && nextPage.getSubmittableAssessment();

		if ((next && next.getID()) !== (prev && prev.getID())) {
			Store.teardownAssessment(prev);
			Store.setupAssessment(next, true);
		}
	}


};
