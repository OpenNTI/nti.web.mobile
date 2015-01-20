'use strict';

var path = require('path');

var React = require('react/addons');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
// var DateTime = require('common/components/DateTime');
var Score = require('common/components/charts/Score');
var AssessmentAPI = require('assessment').Api;
var AssignmentStatusLabel = require('assessment/components/AssignmentStatusLabel');

var Utils = require('common/Utils');
var getService = Utils.getService;

var NTIID = require('dataserverinterface/utils/ntiids');

var SUBMITTED_QUIZ = 'application/vnd.nextthought.assessment.assessedquestionset';

var assignmentType = /assignment/i;

module.exports = React.createClass( {
	displayName: 'CourseOverviewDiscussion',
	mixins: [NavigatableMixin],

	statics: {
		mimeTest: /(naquestionset|naquestionbank|assignment)$/i,
		handles (item) {
			return this.mimeTest.test(item.MimeType);
		},

		canRender  (item, node) {
			var render = true;
			var id = item['Target-NTIID'];

			if (assignmentType.test(item.MimeType) || node.isAssignment(id)) {
				render = Boolean(node && node.getAssignment(id));
			}

			return render;
		}
	},


	getInitialState () {
		return {};
	},


	componentDidMount () {
		getService().then(this.fillInData);
	},


	componentWillReceiveProps () {
		getService().then(this.fillInData);
	},


	fillInData (service) {
		var {item} = this.props;
		var ntiid = item['Target-NTIID'];
		var assignment = this.props.node.getAssignment(ntiid);
		var isAssignment = assignment || assignmentType.test(item.MimeType);

		this.setState({assignment: assignment, loading: true});

		var work;

		if (!isAssignment) {
			work = service.getPageInfo(ntiid)
				.then(pageInfo => pageInfo
					.getUserDataLastOfType(SUBMITTED_QUIZ)
					.then(this.setLatestAttempt)
				)
				.catch(this.maybeNetworkError)
				.catch(this.setNotTaken);

			this.setQuizHref();
		} else {
			this.setQuizHref(); //TODO: build the assignment href

			work = AssessmentAPI.loadPreviousState(assignment)
				.then(this.setAssignmentHistory)
				.catch(this.maybeNetworkError)
				.catch(this.setNotTaken);
		}

		work.then(()=>
			this.setState({loading: false})
		);
	},


	setAssignmentHistory (history) {
		this.setState({
			assignmentHistory: history
		});
	},


	setLatestAttempt  (assessedQuestionSet) {
		this.setState({
			score: assessedQuestionSet.getScore(),
			correct: assessedQuestionSet.getCorrect() || null,
			incorrect: assessedQuestionSet.getIncorrect() || null,
			latestAttempt: assessedQuestionSet,
			completed: true
		});
	},


	maybeNetworkError (reason) {

		if (!reason || reason.statusCode === 0 || reason.statusCode >= 500) {
			if (this.isMounted()) {
				this.setState({networkError: true});
			}
			return;
		}

		return Promise.reject(reason);
	},


	setNotTaken () {
		//mark as not started
		this.setState({
			assignmentHistory: null,
			latestAttempt: null,
			completed: false
		});
	},


	setQuizHref () {
		var ntiid = this.props.item['Target-NTIID'];
		var link = path.join('c', NTIID.encodeForURI(ntiid)) + '/';
		this.setState({href: this.makeHref(link, true)});
	},


	render () {
		var state = this.state;
		var item = this.props.item;
		var questionCount = item["question-count"];
		var label = item.label;

		//var latestAttempt = state.latestAttempt;
		var assignment = state.assignment;
		var assignmentHistory = state.assignmentHistory;

		// var due = assignment && assignment.getDueDate();

		var score = state.score || 0;

		var isLate = assignment && assignment.isLate(new Date());

		var addClass =
			(state.networkError ? ' networkerror' : '') +
			(state.loading ? ' loading' : '') +
			(state.completed ? ' completed' : '') +
			(isLate ? ' late' : '') +
			(assignment ? ' assignment' : ' assessment') +
			(assignmentHistory && assignmentHistory.isSubmitted() ? ' submitted' : '');

		return (
			<a className={'overview-naquestionset' + addClass} href={state.href}>
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
							<AssignmentStatusLabel assignment={assignment} historyItem={assignmentHistory}/>
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
	}
});
