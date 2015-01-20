'use strict';
var React = require('react/addons');

var assessment = require('assessment');

var Store = assessment.Store;


module.exports = {

	renderAssessmentHeader: function () {
		var page = this.state.page;
		var quiz = page && page.getSubmittableAssessment();
		if (!page || !quiz) {
			return null;
		}

		return React.createElement(assessment.SetHeaderWidget, {
			assessment: quiz,
			page: page
		});
	},


	renderAssessmentFeedback: function () {
		var page = this.state.page;
		var quiz = page && page.getSubmittableAssessment();
		if (!page || !quiz) {
			return null;
		}

		return React.createElement(assessment.FeedbackWidget, {
			assessment: quiz,
			page: page
		});
	},


	renderAssessmentSubmission: function () {
		var page = this.state.page;
		var quiz = page && page.getSubmittableAssessment();
		if (!page || !quiz || quiz.IsTimedAssignment || !Store.areAssessmentsSupported()) {
			return null;
		}

		return (
			React.createElement('div', {className: 'fixed-footer'},
				React.createElement('div', {className: 'the-fixed'},
					React.createElement(assessment.SetSubmissionWidget, {
						assessment: quiz,
						page: page
					})
				)
			)
		);
	},


	componentWillUpdate: function(_, nextState) {
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
