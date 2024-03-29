import PropTypes from 'prop-types';
import React from 'react';

import Store from 'internal/assessment/Store';
import {
	areAssessmentsSupported,
	isAssignment,
	isSurvey,
} from 'internal/assessment/utils';
import FeedbackWidget from 'internal/assessment/components/Feedback';
import SetHeaderWidget from 'internal/assessment/components/Header';
import SetSubmissionWidget from 'internal/assessment/components/Submission';

export { isAssignment, isSurvey };

function getContentHash(assessment) {
	if (!assessment) {
		return null;
	}

	return assessment
		.getQuestions()
		.map(x => x.getID())
		.join(',');
}

export default {
	propTypes: {
		assessment: PropTypes.object,
		assessmentHistory: PropTypes.object,
		onTryAgain: PropTypes.func,
		userId: PropTypes.string,
	},

	componentDidUpdate(prevProps, prevState) {
		const prev = this.getAssessment(prevProps, prevState);
		const next = this.getAssessment(this.props, this.state);

		const assessmentChanged =
			(next && next.getID()) !== (prev && prev.getID());
		const historyChanged =
			prevProps.assessmentHistory !== this.props.assessmentHistory;

		if (
			assessmentChanged ||
			historyChanged ||
			(this.state.page && !Store.isActive(next))
		) {
			Store.teardownAssessment(prev);
			this.setupAssessment(this.props, this.state);
		}
	},

	componentWillUnmount() {
		const assess = this.getAssessment();
		if (assess) {
			Store.teardownAssessment(assess);
		}
	},

	needsAssessmentUpdate(props = this.props) {
		const { assessment } = props;

		if (!assessment) {
			return false;
		}

		const contentHash = getContentHash(assessment);
		const { currentContentHash } = this.state;

		return contentHash !== currentContentHash;
	},

	getAssessmentState(props = this.props) {
		const { assessment } = props;

		if (!assessment) {
			return {};
		}

		return { currentContentHash: getContentHash(assessment) };
	},

	setupAssessment(props = this.props, state = this.state) {
		const assess = this.getAssessment(props, state);
		const { contentPackage, assessmentHistory = true, userId } = props;

		// To be administrative, the content package must be decendent to
		// an CourseInstanceAdministrativeRole AND its for an Instructor,
		// AND the assessment has to be an Assignment. (Self-Assessments
		// are presently defined as not being administered.)
		const role =
			contentPackage && contentPackage.parent('isAdministrative');
		const admin = Boolean(
			role && role.isInstructor && assess && isAssignment(assess)
		);

		Store.setupAssessment(assess, assessmentHistory, admin, userId);
	},

	getAssessment(props = this.props, state = this.state) {
		const { assessment } = props;
		const { page } = state || {};
		return assessment || (page && page.getSubmittableAssessment());
	},

	renderAssessmentHeader() {
		const { onTryAgain } = this.props;
		const {
			state: { page },
		} = this;
		let quiz = this.getAssessment();
		if (!page || !quiz) {
			return null;
		}

		return React.createElement(SetHeaderWidget, {
			assessment: quiz,
			page,
			onTryAgain,
		});
	},

	renderAssessmentFeedback() {
		const {
			state: { page },
		} = this;
		const quiz = this.getAssessment();
		if (!page || !quiz) {
			return null;
		}

		return React.createElement(FeedbackWidget, {
			assessment: quiz,
			page,
		});
	},

	renderAssessmentSubmission() {
		const { userId } = this.props;
		const { page } = this.state;
		const quiz = this.getAssessment();
		if (
			!page ||
			!quiz ||
			quiz.IsTimedAssignment ||
			!areAssessmentsSupported()
		) {
			return null;
		}

		return React.createElement(SetSubmissionWidget, {
			assessment: quiz,
			perspective: userId,
			page,
		});
	},
};
