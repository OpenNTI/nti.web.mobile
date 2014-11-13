'use strict';
var React = require('react/addons');

var assessment = require('assessment');
var Store = assessment.Store;
var SetSubmission = assessment.SetSubmissionWidget;

module.exports = {

	renderAssessmentSubmission: function () {
		var div = React.DOM.div;
		var page = this.state.pageData;
		var quiz = page.getSubmittableAssessment();
		if (!page || !quiz) {
			return null;
		}

		return (
			div({className: 'fixed-footer'},
				div({className: 'the-fixed'}, SetSubmission({assessment: quiz})))
		);
	},


	//componentDidUpdate: function(/*prevProps, prevState*/) {},

	componentWillUpdate: function(_, nextState) {
		var page = nextState && nextState.pageData;
		if (this.state.pageData !== page) {
			Store.setupAssessment(page && page.getSubmittableAssessment());
		}
	}


};
