import './HeaderScoreboard.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {DateTime} from '@nti/web-commons';
import {getEventTarget} from '@nti/lib-dom';

import Score from 'common/components/charts/Score';

import Store from '../Store';
import {clearAssessmentAnswers} from '../Actions';

//Still need to get the list of previous attempts. Not just the last one.

export default class HeaderScoreboard extends React.Component {

	static propTypes = {
		assessment: PropTypes.object
	}

	state = this.getInitialState()

	getInitialState () {
		return {
			total: 0,
			correct: 0,
			incorrect: 0,
			score: 0,
			previousAttemps: ''
		};
	}

	componentDidMount () {
		Store.addChangeListener(this.synchronizeFromStore);
		this.synchronizeFromStore();
	}


	componentWillUnmount () {
		Store.removeChangeListener(this.synchronizeFromStore);
	}


	componentDidUpdate (props) {
		if (props.assessment !== this.props.assessment) {
			this.synchronizeFromStore(props);
		}
	}


	synchronizeFromStore = (props) => {
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
	}


	reset = (e) => {
		if (getEventTarget(e, 'span[data-dropdown]')) {
			return;
		}

		clearAssessmentAnswers(this.props.assessment);
	}


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
								{state.correct && (
									<div className="stat correct">
										<span className="count">{state.correct}</span> correct </div>
								)}
								{state.incorrect && (
									<div className="stat incorrect">
										<span className="count">{state.incorrect}</span> incorrect </div>
								)}
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
}
