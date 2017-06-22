import PropTypes from 'prop-types';
import React from 'react';

import Store from 'assessment/Store';
import {areAssessmentsSupported, isAssignment} from 'assessment/utils';
import FeedbackWidget from 'assessment/components/Feedback';
import SetHeaderWidget from 'assessment/components/Header';
import SetSubmissionWidget from 'assessment/components/Submission';

export {isAssignment};

export default {

	propTypes: {
		assessment: PropTypes.object,
		assessmentHistory: PropTypes.object
	},


	componentWillUpdate (nextProps, nextState) {
		const prev = this.getAssessment(this.props, this.state);
		const next = this.getAssessment(nextProps, nextState);

		const assessmentChanged = (next && next.getID()) !== (prev && prev.getID());
		const historyChanged = nextProps.assessmentHistory !== this.props.assessmentHistory;

		if (assessmentChanged || historyChanged || (nextState.page && !Store.isActive(next))) {
			Store.teardownAssessment(prev);
			this.setupAssessment(nextProps, nextState);
		}
	},


	componentWillUnmount () {
		const assess = this.getAssessment();
		if(assess) {
			Store.teardownAssessment(assess);
		}
	},


	setupAssessment (props = this.props, state = this.state) {
		const assess = this.getAssessment(props, state);
		const {contentPackage, assessmentHistory = true} = props;

		// To be administrative, the content package must be decendent to
		// an CourseInstanceAdministrativeRole AND its for an Instructor,
		// AND the assessment has to be an Assignment. (Self-Assessments
		// are presently defined as not being administered.)
		const role = contentPackage && contentPackage.parent('isAdministrative');
		const admin = Boolean(
			role && role.isInstructor &&
						assess && isAssignment(assess)
		);

		Store.setupAssessment(assess, assessmentHistory, admin);
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
