'use strict';
var React = require('react/addons');

var Store = require('assessment/Store');
var Utils = require('assessment/Utils');
var FeedbackWidget = require('assessment/components/Feedback');
var SetHeaderWidget = require('assessment/components/Header');
var SetSubmissionWidget = require('assessment/components/Submission');


module.exports = {

	renderAssessmentHeader: function () {
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


	renderAssessmentFeedback: function () {
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


	renderAssessmentSubmission: function () {
		var page = this.state.page;
		var quiz = page && page.getSubmittableAssessment();
		if (!page || !quiz || quiz.IsTimedAssignment || !Utils.areAssessmentsSupported()) {
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
