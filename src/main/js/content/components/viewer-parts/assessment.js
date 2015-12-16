import React from 'react';

import Store from 'assessment/Store';
import {areAssessmentsSupported, isAssignment} from 'assessment/utils';
import FeedbackWidget from 'assessment/components/Feedback';
import SetHeaderWidget from 'assessment/components/Header';
import SetSubmissionWidget from 'assessment/components/Submission';

export {isAssignment};

export default {

	propTypes: {
		assessment: React.PropTypes.object,
		assessmentHistory: React.PropTypes.object
	},


	componentWillMount () {
		if(this.getAssessment()) {
			this.setupAssessment();
		}
	},


	componentWillUpdate (nextProps, nextState) {
		const prev = this.getAssessment(this.props, this.state);
		const next = this.getAssessment(nextProps, nextState);


		if ((next && next.getID()) !== (prev && prev.getID())) {
			Store.teardownAssessment(prev);
			this.setupAssessment(nextProps, nextState);
		}
	},


	setupAssessment (props = this.props, state = this.state) {
		const assess = this.getAssessment(props, state);
		const {contentPackage} = props;

		//To be administrative, the content package must be decendent to an
		//CourseInstanceAdministrativeRole, AND the assessment has to be an
		//Assignment. (Self-Assessments are presently defined as not being
		// administered.)
		const admin = Boolean(contentPackage &&
					contentPackage.parent('isAdministrative') &&
					assess && isAssignment(assess));

		Store.setupAssessment(assess, true, admin);
	},


	getAssessment (props = this.props, state = this.state) {
		const {assessment} = props;
		const {page} = state || {};
		return assessment || (page && page.getSubmittableAssessment());
	},


	renderAssessmentHeader () {
		const {state: {page}} = this;
		let quiz = this.getAssessment();
		if (!page || !quiz) {
			return null;
		}

		return React.createElement(SetHeaderWidget, {
			assessment: quiz,
			page
		});
	},


	renderAssessmentFeedback () {
		const {state: {page}} = this;
		const quiz = this.getAssessment();
		if (!page || !quiz) {
			return null;
		}

		return React.createElement(FeedbackWidget, {
			assessment: quiz,
			page
		});
	},


	renderAssessmentSubmission () {
		const {page} = this.state;
		const quiz = this.getAssessment();
		if (!page || !quiz || quiz.IsTimedAssignment || !areAssessmentsSupported()) {
			return null;
		}

		return React.createElement(SetSubmissionWidget, {
			assessment: quiz,
			page
		});
	}
};
