import React from 'react';
import Transition from 'react/lib/ReactCSSTransitionGroup';

import {scoped} from 'common/locale';
const t = scoped('ASSESSMENT');

import Loading from 'common/components/Loading';

import Store from '../Store';
import {areAssessmentsSupported} from '../Utils';
import {resetAssessment, submit} from '../Actions';
import {
	BUSY_SAVEPOINT,
	BUSY_SUBMITTING,
	BUSY_LOADING
} from '../Constants';

import Prompt from 'prompts';


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

		Prompt.areYouSure('This will reset this assignment.')
			.then(
				()=>resetAssessment(this.props.assessment),
				()=>{}
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

		if (admin || Store.isSubmitted(assessment) || !areAssessmentsSupported()) {
			return null;
		}

		busy = (busy === BUSY_SUBMITTING || busy === BUSY_LOADING);

		return (
			<div>
				<Transition transitionName="savepoint">
					{savePoint && this.renderSavePointNotice()}
				</Transition>
				<div className={'set-submission ' + status}>
					{!error ? null : (
						<div className="error">
							<a href="#" onClick={this.dismissAssessmentError}>x</a>{error}
						</div>
					)}
					<a href={disabled?'#':null} className={'button ' + (disabled?'disabled':'')} onClick={this.onSubmit}>{t('submit')}</a>
					{cannotReset? null: (<a href="#" className="reset button link" onClick={this.onReset}>{t('reset')}</a>)}
					<span className="status-line">{t('unanswered', { count: unanswered  })}</span>
				</div>

				{!busy ? null : <Loading message="Please Wait" maskScreen/>}
			</div>
		);
	},


	renderSavePointNotice () {
		return (
			<div className="saving-progress" key="savepoint">Saving Progress</div>
		);
	}
});
