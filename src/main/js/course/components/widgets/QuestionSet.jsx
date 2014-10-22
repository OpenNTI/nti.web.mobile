/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var DateTime = require('common/components/DateTime');
var Score = require('common/components/charts/Score');

var getService = require('common/Utils').getService;

var SUBMITTED_QUIZ = 'application/vnd.nextthought.assessment.assessedquestionset';

module.exports = React.createClass( {
	displayName: 'CourseOverviewDiscussion',

	statics: {
		mimeTest: /(naquestionset|naquestionbank|assignment)$/i,
		handles: function(item) {
			return this.mimeTest.test(item.MimeType);
		}
	},


	getInitialState: function() {
		return {};
	},


	componentDidMount: function() {
		getService().then(this.fillInData);
	},


	fillInData: function(service) {

		function getLastQuizSubmission(pageInfo) {
			return pageInfo
				.getUserDataLastOfType(SUBMITTED_QUIZ)
				.then(setLatestAttempt);
		}

		var setLatestAttempt = this.setLatestAttempt;
		var ntiid = this.props.item['Target-NTIID'];
		var assignment = this.props.node.getAssignment(ntiid);

		this.setState({ assignment: assignment });

		if (!assignment) {
			service.getPageInfo(ntiid)
				.then(getLastQuizSubmission)
				.catch(this.setNotTaken);
		}
	},

	setLatestAttempt: function (assessedQuestionSet) {
		console.debug(assessedQuestionSet);
		this.setState({
			score: assessedQuestionSet.getScore(),
			correct: assessedQuestionSet.getCorrect(),
			incorrect: assessedQuestionSet.getIncorrect(),
			latestAttempt: assessedQuestionSet,
			completed: true
		});
	},

	setNotTaken: function() {
		//mark as not started
		this.setState({
			latestAttempt: null,
			completed: false
		});
	},


	render: function() {
		var item = this.props.item;
		var questionCount = item["question-count"];
		var label = item.label;

		var latestAttempt = this.state.latestAttempt;
		var assignment = this.state.assignment;

		var due = assignment && assignment.getDueDate();

		var score = this.state.score || 0;

		var isLate = assignment && assignment.isLate(new Date());

		var addClass =
			(this.state.completed ? " completed" : "") +
			(isLate ? " late" : "") +
			(assignment ? " assignment" : " assessment");

		return (
			<div className={'overview-naquestionset' + addClass}>
				<div className={'body'}>
					{assignment ?
						<div className="icon assignment"/>
					: //Assessment:
						<div className="icon assessmentScore">
							<Score width="40" height="40" score={score}/>
						</div>
					}
					<div className={'tally-box'}>
						<div className={'message'}>{label}</div>
						{assignment ?

							<div className="tally">
								<div className='stat due-date late'>Due <DateTime date={due}/></div>
								<div className='stat due-date'>Due <DateTime date={due}/></div>
							</div>

						: //Assessment:
							<div className="tally">
								<div className="stat correct">
									<span className="count">{this.state.correct}</span> correct </div>
								<div className="stat incorrect">
									<span className="count">{this.state.incorrect}</span> incorrect </div>
								<div className="stat questions">{questionCount} questions</div>
							</div>
						}
					</div>
				</div>
			</div>
		);

	}
});
