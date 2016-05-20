import React from 'react';
import cx from 'classnames';

import {TinyLoader as Loading} from 'nti-web-commons';

import {scoped} from 'nti-lib-locale';
const t = scoped('ASSESSMENT');

import Store from '../Store';
import {areAssessmentsSupported} from '../utils';
import {submit, clearAssessmentAnswers} from '../Actions';

const STATUS_MAP = {
	'true': 'Correct',
	'false': 'Incorrect'
};

export default React.createClass({
	displayName: 'QuestionSubmission',

	propTypes: {
		question: React.PropTypes.object.isRequired
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

		let {question} = this.props;

		if (Store.canReset(question)) {
			clearAssessmentAnswers(question);
		}
	},


	onSubmit (e) {
		let {question} = this.props;

		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}

		if (Store.canSubmit(question)) {
			submit(question);
		}
	},


	dismissAssessmentError (e) {
		if (e) {
			e.preventDefault();
			e.stopPropagation();
		}
		Store.clearError(this.props.question);
	},


	render () {
		let {question} = this.props;

		if (!areAssessmentsSupported()) {
			return;
		}

		let prefix = question.MimeType.replace(/application\/vnd\.nextthought\./, '');

		let assessed = Store.getAssessedQuestion(question, question.getID());
		let submitted = Store.isSubmitted(question);
		let disabled = (!submitted && !Store.canSubmit(question))
					|| ( submitted && !Store.canReset(question));

		//correct, incorrect, blank
		let correctness = assessed && assessed.isCorrect();
		let correct = correctness === true;
		let status = STATUS_MAP[correctness] || '';

		let busy = Store.getBusyState(question);
		let error = Store.getError(question);

		let wrapperClass = cx('question-submission', status.toLowerCase());

		let buttonClass = cx('button', {
			'disabled': disabled,
			'caution': submitted && !correct,
			'hidden': submitted && correct
		});

		return (
			<div className={wrapperClass}>
				{!error ? null : (
					<div className="error">
						<a href="#" onClick={this.dismissAssessmentError}>x</a>{error}
					</div>
				)}

				<a href="#" className={buttonClass} onClick={submitted ? this.onReset : this.onSubmit}>
					{t(`${prefix}-${submitted ? 'reset' : 'submit'}`)}
				</a>

				{!busy ? null : <Loading/>}
			</div>
		);
	}
});
