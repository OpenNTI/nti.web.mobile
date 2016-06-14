import React from 'react';
import Transition from 'react-addons-css-transition-group';

import {scoped} from 'nti-lib-locale';
const t = scoped('ASSESSMENT');

import {Loading} from 'nti-web-commons';

import Saving from './Saving';
import SubmissionError from './SubmissionError';

import Store from '../Store';
import {areAssessmentsSupported, getMainSubmittable} from '../utils';
import {resetAssessment, submit} from '../Actions';
import {
	BUSY_SAVEPOINT,
	BUSY_SUBMITTING,
	BUSY_LOADING
} from '../Constants';

import {areYouSure} from 'prompts';

const isNoSubmit = submittable => submittable.isNonSubmit && submittable.isNonSubmit();

export default React.createClass({
	displayName: 'SetSubmission',

	propTypes: {
		/**
		 * The QuestionSet or Assignment to be submitted.
		 *
		 * @type {QuestionSet/Assignment}
		 */
		assessment: React.PropTypes.object.isRequired
	},


	componentDidMount () {
		Store.addChangeListener(this.onChange);
	},


	componentWillUnmount () {
		Store.removeChangeListener(this.onChange);
	},


	onChange () {
		this.forceUpdate();
	},


	onReset (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		areYouSure('This will reset this assignment.')
			.then(
				()=> resetAssessment(this.props.assessment),
				()=> {}
			);
	},


	onSubmit (e) {
		let {assessment} = this.props;
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		if (Store.canSubmit(assessment)) {
			submit(assessment);
		}
	},


	dismissAssessmentError (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		Store.clearError(this.props.assessment);
	},


	render () {
		let {assessment} = this.props;

		let admin = Store.isAdministrative(assessment);
		let disabled = admin || !Store.canSubmit(assessment);
		let cannotReset = Store.isSubmitted(assessment) || disabled;

		let unanswered = Store.countUnansweredQuestions(assessment);
		let status = unanswered ? 'incomplete' : 'complete';

		let busy = Store.getBusyState(assessment);
		let error = Store.getError(assessment);
		let savePoint = busy === BUSY_SAVEPOINT;
		let mainSubmittable = getMainSubmittable(assessment);

		if (admin || Store.isSubmitted(assessment) || !areAssessmentsSupported() || Store.aggregationViewState(assessment) || isNoSubmit(mainSubmittable)) {
			return null;
		}

		busy = (busy === BUSY_SUBMITTING || busy === BUSY_LOADING);

		return (
			<div>
				<Transition transitionName="savepoint" transitionEnterTimeout={700} transitionLeaveTimeout={1000}>
					{savePoint && (
						<Saving key="savepoint"/>
					)}
				</Transition>
				<div className={'set-submission ' + status}>
					{!error ? null : (
						<SubmissionError onClick={this.dismissAssessmentError} error={error}/>
					)}
					<a href={disabled ? '#' : null} className={'button ' + (disabled ? 'disabled' : '')} onClick={this.onSubmit}>{t('submit')}</a>
					{cannotReset ? null : (<a href="#" className="reset button link" onClick={this.onReset}>{t('reset')}</a>)}
					<span className="status-line">{t('unanswered', { count: unanswered })}</span>
				</div>

				{!busy ? null : <Loading message="Please Wait" maskScreen/>}
			</div>
		);
	}
});
