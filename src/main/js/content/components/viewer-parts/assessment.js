'use strict';
var React = require('react/addons');

var assessment = require('assessment');
var Store = assessment.Store;
var SetSubmission = assessment.SetSubmissionWidget;

module.exports = {

	renderAssessmentSubmission: function () {
		var div = React.DOM.div;
		var page = this.state.pageData;
		var quiz = page && page.getSubmittableAssessment();
		if (!page || !quiz) {
			return null;
		}

		return (
			div({className: 'fixed-footer'},
				div({className: 'the-fixed'}, SetSubmission({assessment: quiz})))
		);
	},


	componentWillUpdate: function(_, nextState) {
		var prevPage = this.state.pageData;
		var nextPage = nextState && nextState.pageData;

		var prev = prevPage && prevPage.getSubmittableAssessment();
		var next = nextPage && nextPage.getSubmittableAssessment();

		if ((next && next.getID()) !== (prev && prev.getID())) {
			Store.teardownAssessment(prev);
			Store.setupAssessment(next, true);
		}
	}


};
