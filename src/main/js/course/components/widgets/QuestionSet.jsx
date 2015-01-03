'use strict';

var path = require('path');

var React = require('react/addons');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var DateTime = require('common/components/DateTime');
var Score = require('common/components/charts/Score');

var Utils = require('common/Utils');
var getEventTarget = Utils.Dom.getEventTarget;
var getService = Utils.getService;

var NTIID = require('dataserverinterface/utils/ntiids');

var SUBMITTED_QUIZ = 'application/vnd.nextthought.assessment.assessedquestionset';

var assignmentType = /assignment/i;

module.exports = React.createClass( {
	displayName: 'CourseOverviewDiscussion',
	mixins: [NavigatableMixin],

	statics: {
		mimeTest: /(naquestionset|naquestionbank|assignment)$/i,
		handles: function(item) {
			return this.mimeTest.test(item.MimeType);
		},

		canRender: function (item, node) {
			var render = true;

			if (assignmentType.test(item.MimeType)) {
				render = Boolean(node && node.getAssignment(item['Target-NTIID']));
			}

			return render;
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
		var item = this.props.item;
		var ntiid = item['Target-NTIID'];
		var assignment = this.props.node.getAssignment(ntiid);
		var isAssignment = assignment || assignmentType.test(item.MimeType);

		this.setState({
			assignment: assignment,
			href: '#'
		});

		if (!isAssignment) {
			service.getPageInfo(ntiid)
				.then(getLastQuizSubmission)
				.catch(this.setNotTaken)
				.then(this.setQuizHref);
		} else {
			this.setQuizHref(); //TODO: build the assignment href
		}
	},


	setLatestAttempt: function (assessedQuestionSet) {
		console.debug(assessedQuestionSet);
		this.setState({
			score: assessedQuestionSet.getScore(),
			correct: assessedQuestionSet.getCorrect() || null,
			incorrect: assessedQuestionSet.getIncorrect() || null,
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


	setQuizHref: function() {
		var ntiid = this.props.item['Target-NTIID'];
		var link = path.join('c', NTIID.encodeForURI(ntiid)) + '/';
		this.setState({href: this.makeHref(link, true)});
	},


	render: function() {
		var state = this.state;
		var item = this.props.item;
		var questionCount = item["question-count"];
		var label = item.label;

		//var latestAttempt = state.latestAttempt;
		var assignment = state.assignment;

		var due = assignment && assignment.getDueDate();

		var score = state.score || 0;

		var isLate = assignment && assignment.isLate(new Date());

		var addClass =
			(/^#?$/.test(state.href) ? ' disabled' : '') +
			(state.completed ? " completed" : "") +
			(isLate ? " late" : "") +
			(assignment ? " assignment" : " assessment");

		return (
			<a className={'overview-naquestionset' + addClass} href={state.href} onClick={this.onClick}>
				<div className="body">
					{assignment ?
						<div className="icon assignment"/>
					: //Assessment:
						<div className="icon assessmentScore">
							<Score width="40" height="40" score={score}/>
						</div>
					}
					<div className="tally-box">
						<div className="message">{label}</div>
						{assignment ?

							<div className="tally">
								<div className="stat due-date late">Due <DateTime date={due}/></div>
								<div className="stat due-date">Due <DateTime date={due}/></div>
							</div>

						: //Assessment:
							<div className="tally">
							{state.correct && (
								<div className="stat correct">
									<span className="count">{state.correct}</span> correct </div>
							)}
							{state.incorrect && (
								<div className="stat incorrect">
									<span className="count">{state.incorrect}</span> incorrect </div>
							)}
								<div className="stat questions">{questionCount} questions</div>
							</div>
						}
					</div>
				</div>
			</a>
		);
	},


	onClick: function (e) {
		var a = getEventTarget(e, 'a[href]');
		a = a && a.getAttribute('href');
		//If there is a url to go to, let it go.
		if (a && a !== '#') {
			return;
		}

		e.preventDefault();
		e.stopPropagation();

		/*global alert */
		alert('Coming soon to mobile.\nUntil then, please use a desktop or iPad app to access.');

	}
});
