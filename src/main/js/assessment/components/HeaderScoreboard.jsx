'use strict';

var React = require('react');

var Score = require('common/components/charts/Score');
var DateTime = require('common/components/DateTime');

var {getEventTarget} = require('common/utils/dom');

var Store = require('../Store');
var Actions = require('../Actions');

//Still need to get the list of previous attempts. Not just the last one.

module.exports = React.createClass({
	displayName: 'HeaderScoreboard',

	getInitialState: function() {
		return {
			total: 0,
			correct: 0,
			incorrect: 0,
			score: 0,
			previousAttemps: ''
		};
	},


	componentDidMount: function() {
		Store.addChangeListener(this.synchronizeFromStore);
		this.synchronizeFromStore();
	},


	componentWillUnmount: function() {
		Store.removeChangeListener(this.synchronizeFromStore);
	},


	componentWillReceiveProps: function(props) {
		this.synchronizeFromStore(props);
	},


	synchronizeFromStore: function(props) {
		var assessment = (props && props.assessment) || this.props.assessment;
		var assessed = Store.getAssessedSubmission(assessment);

		if (!assessed) {
			this.setState(this.getInitialState());
			return;
		}

		var questionCount = assessed.getQuestions ? assessed.getQuestions().length : 1;

		this.setState({
			total: questionCount,
			score: assessed.getScore(),
			correct: assessed.getCorrect() || null,
			incorrect: assessed.getIncorrect() || null,
			dateSubmitted: assessed.getCreatedTime()
		});
	},


	reset: function (e) {
		if (getEventTarget(e, 'span[data-dropdown]')) {
			return;
		}

		Actions.resetAssessment(this.props.assessment, true);
	},


	render: function() {
		var state = this.state;
		var assessment = this.props.assessment;
		var submitted = Store.isSubmitted(assessment);
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
