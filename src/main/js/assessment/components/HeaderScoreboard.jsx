/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Score = require('common/components/charts/Score');


var Store = require('../Store');

module.exports = React.createClass({
	displayName: 'HeaderScoreboard',

	getInitialState: function() {
		return {
			total: 0,
			correct: 0,
			incorrect: 0,
			score: 0
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
			correct: assessed.getCorrect(),
			incorrect: assessed.getIncorrect()
		});
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
				<div className="scoreboard body">
					<div className="score">
						<Score width="60" height="60" score={state.score}/>
					</div>
					<div className="reset-button">
						<button>Try Again</button>
					</div>

					<div className="tally">
						<h3>Results:</h3>
						<div className="stat correct">
							<span className="count">{state.correct}</span> correct </div>
						<div className="stat incorrect">
							<span className="count">{state.incorrect}</span> incorrect </div>
					</div>
				</div>
			</div>
		);
	}
});
