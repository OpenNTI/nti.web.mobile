import path from 'path';

import React from 'react';

import NavigatableMixin from 'common/mixins/NavigatableMixin';
// import DateTime from 'common/components/DateTime';
import Score from 'common/components/charts/Score';

import AssignmentStatusLabel from 'assessment/components/AssignmentStatusLabel';
import {loadPreviousState} from 'assessment/Api';

import {getService} from 'common/utils';
import SetStateSafely from 'common/mixins/SetStateSafely';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

const SUBMITTED_QUIZ = 'application/vnd.nextthought.assessment.assessedquestionset';

const assignmentType = /assignment/i;

export default React.createClass( {
	displayName: 'CourseOverviewDiscussion',
	mixins: [NavigatableMixin, SetStateSafely],

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

		this.setStateSafely({assignment: assignment, loading: true});

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

			work = loadPreviousState(assignment)
				.then(this.setAssignmentHistory)
				.catch(this.maybeNetworkError)
				.catch(this.setNotTaken);
		}

		work.then(()=>
			this.setStateSafely({loading: false})
		);
	},


	setAssignmentHistory (history) {
		this.setStateSafely({
			assignmentHistory: history
		});
	},


	setLatestAttempt  (assessedQuestionSet) {
		this.setStateSafely({
			score: assessedQuestionSet.getScore(),
			correct: assessedQuestionSet.getCorrect() || null,
			incorrect: assessedQuestionSet.getIncorrect() || null,
			latestAttempt: assessedQuestionSet,
			completed: true
		});
	},


	maybeNetworkError (reason) {

		if (!reason || reason.statusCode === 0 || reason.statusCode >= 500) {
			this.setStateSafely({networkError: true});
			return;
		}

		return Promise.reject(reason);
	},


	setNotTaken () {
		//mark as not started
		this.setStateSafely({
			assignmentHistory: null,
			latestAttempt: null,
			completed: false
		});
	},


	setQuizHref () {
		var ntiid = this.props.item['Target-NTIID'];
		var link = path.join('c', encodeForURI(ntiid)) + '/';
		this.setStateSafely({href: this.makeHref(link, true)});
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
