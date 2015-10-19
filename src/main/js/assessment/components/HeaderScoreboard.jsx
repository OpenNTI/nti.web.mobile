import React from 'react';

import Score from 'common/components/charts/Score';
import DateTime from 'common/components/DateTime';

import {getEventTarget} from 'nti.lib.dom';

import Store from '../Store';
import {clearAssessmentAnswers} from '../Actions';

//Still need to get the list of previous attempts. Not just the last one.

export default React.createClass({
	displayName: 'HeaderScoreboard',

	propTypes: {
		assessment: React.PropTypes.object
	},

	getInitialState () {
		return {
			total: 0,
			correct: 0,
			incorrect: 0,
			score: 0,
			previousAttemps: ''
		};
	},


	componentDidMount () {
		Store.addChangeListener(this.synchronizeFromStore);
		this.synchronizeFromStore();
	},


	componentWillUnmount () {
		Store.removeChangeListener(this.synchronizeFromStore);
	},


	componentWillReceiveProps (props) {
		this.synchronizeFromStore(props);
	},


	synchronizeFromStore (props) {
		let assessment = (props && props.assessment) || this.props.assessment;
		let assessed = Store.getAssessedSubmission(assessment);

		if (!assessed) {
			this.setState(this.getInitialState());
			return;
		}

		let questionCount = assessed.getQuestions ? assessed.getQuestions().length : 1;

		this.setState({
			total: questionCount,
			score: assessed.getScore(),
			correct: assessed.getCorrect() || null,
			incorrect: assessed.getIncorrect() || null,
			dateSubmitted: assessed.getCreatedTime()
		});
	},


	reset (e) {
		if (getEventTarget(e, 'span[data-dropdown]')) {
			return;
		}

		clearAssessmentAnswers(this.props.assessment);
	},


	render () {
		let state = this.state;
		let assessment = this.props.assessment;
		let submitted = Store.isSubmitted(assessment);
		if (!submitted) {
			return null;
		}

		return (
			<div className="header assessment">
				<div className="scoreboard">
					<div className="header">
						Scoreboard
						<DateTime date={state.dateSubmitted} format="LLL"/>
					</div>
					<div className="body">
						<div className="score">
							<Score width="60" height="60" score={state.score}/>
						</div>

						<div className="tally">
							<div className="tally-box">
								<h4>Results:</h4>
							{state.correct &&
								<div className="stat correct">
									<span className="count">{state.correct}</span> correct </div>
								}
							{state.incorrect &&
								<div className="stat incorrect">
									<span className="count">{state.incorrect}</span> incorrect </div>
								}
							</div>
						</div>


						<div className="reset-button">
							<button onClick={this.reset} className="tiny secondary radius button">
								Try Again
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
});
