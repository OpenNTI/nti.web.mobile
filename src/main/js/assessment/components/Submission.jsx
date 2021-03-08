import './Submission.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { scoped } from '@nti/lib-locale';
import { Prompt, Loading } from '@nti/web-commons';

import Store from '../Store';
import { areAssessmentsSupported, getMainSubmittable } from '../utils';
import { resetAssessment, submit } from '../Actions';
import {
	BUSY_SAVEPOINT,
	BUSY_SUBMITTING,
	BUSY_LOADING,
	ERROR,
} from '../Constants';

import Saving from './Saving';
import SubmissionError from './SubmissionError';

const t = scoped('assessment.submission', {
	submit: "I'm Finished!",
	reset: 'Cancel',
	unanswered: {
		zero: 'All questions answered',
		one: '%(count)s question unanswered',
		other: '%(count)s questions unanswered',
	},
});

const isNoSubmit = submittable =>
	submittable.isNonSubmit && submittable.isNonSubmit();

const forceNumber = x => (typeof x === 'number' ? x : NaN);

export default class extends React.Component {
	static displayName = 'Submission';

	static propTypes = {
		/**
		 * The QuestionSet or Assignment to be submitted.
		 *
		 * @type {QuestionSet/Assignment}
		 */
		assessment: PropTypes.object.isRequired,
	};

	componentDidMount() {
		Store.addChangeListener(this.onChange);
	}

	componentWillUnmount() {
		Store.removeChangeListener(this.onChange);
	}

	onChange = e => {
		if (e.type === ERROR) {
			e = Store.getError(this.props.assessment);
			if (e && e.statusCode === 409) {
				Store.clearError(this.props.assessment);
				Prompt.alert(
					'This assignment has changed, and needs to reload.'
				).then(() => global.location.reload());
				return;
			}
		}
		this.forceUpdate();
	};

	onReset = e => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		Prompt.areYouSure('This will reset this assignment.').then(
			() => resetAssessment(this.props.assessment),
			() => {}
		);
	};

	onSubmit = e => {
		let { assessment } = this.props;
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		if (Store.canSubmit(assessment)) {
			submit(assessment);
		}
	};

	dismissAssessmentError = e => {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		Store.clearError(this.props.assessment);
	};

	render() {
		const { assessment } = this.props;

		const admin = Store.isAdministrative(assessment);
		const disabled = !Store.canSubmit(assessment);

		const cannotReset =
			Store.isSubmitted(assessment) ||
			disabled ||
			assessment.isAssignment;

		const unanswered = forceNumber(
			Store.countUnansweredQuestions(assessment)
		);
		const status = unanswered ? 'incomplete' : 'complete';

		let busy = Store.getBusyState(assessment);
		const error = Store.getError(assessment);
		const savePoint = busy === BUSY_SAVEPOINT;
		const mainSubmittable = getMainSubmittable(assessment);

		if (
			admin ||
			// !Store.isAvailable(assessment) ||
			Store.isSubmitted(assessment) ||
			!areAssessmentsSupported() ||
			Store.aggregationViewState(assessment) ||
			isNoSubmit(mainSubmittable)
		) {
			return null;
		}

		busy = busy === BUSY_SUBMITTING || busy === BUSY_LOADING;

		return (
			<div>
				<TransitionGroup>
					{savePoint && (
						<CSSTransition
							key="savepoint"
							classNames="savepoint"
							timeout={{ enter: 700, exit: 1000 }}
						>
							<Saving />
						</CSSTransition>
					)}
				</TransitionGroup>
				<div className={'set-submission ' + status}>
					{!error ? null : (
						<SubmissionError
							onClick={this.dismissAssessmentError}
							error={error}
						/>
					)}
					<a
						href={disabled ? '#' : null}
						className={'button ' + (disabled ? 'disabled' : '')}
						onClick={this.onSubmit}
					>
						{t('submit')}
					</a>
					{cannotReset ? null : (
						<a
							href="#"
							className="reset button link"
							onClick={this.onReset}
						>
							{t('reset')}
						</a>
					)}
					<span className="status-line">
						{!isNaN(unanswered) &&
							t('unanswered', { count: unanswered })}
					</span>
				</div>

				{!busy ? null : (
					<Loading.Mask message="Please Wait" maskScreen />
				)}
			</div>
		);
	}
}
