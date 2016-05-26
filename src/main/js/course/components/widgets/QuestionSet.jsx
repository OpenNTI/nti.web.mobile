import path from 'path';

import React from 'react';

import cx from 'classnames';

import {getModel} from 'nti-lib-interfaces';

import {Mixins} from 'nti-web-commons';
// import {DateTime} from 'nti-web-commons';
import Score from 'common/components/charts/Score';

import AssignmentStatusLabel from 'assessment/components/AssignmentStatusLabel';
import {loadPreviousState} from 'assessment/Api';

import {getService} from 'nti-web-client';

import {encodeForURI} from 'nti-lib-ntiids';

const SUBMITTED_QUIZ = 'application/vnd.nextthought.assessment.assessedquestionset';

const assignmentType = /assignment/i;

const OutlineNode = getModel('courses.courseoutlinenode');

const getID = o => o['Target-NTIID'] || (o.getID ? o.getID() : o['NTIID']);
const getQuestionCount = o => o.getQuestionCount ? o.getQuestionCount() : o['question-count'];

export default React.createClass( {
	displayName: 'CourseOverviewDiscussion',
	mixins: [Mixins.NavigatableMixin],

	statics: {
		mimeTest: /(questionset|questionbank|assignment)/i,
		handles (item) {
			return this.mimeTest.test(item.MimeType);
		},

		canRender  (item, node, collection) {
			//Collection will be null when there are no assignments.
			const id = getID(item);
			const isAssignment = assignmentType.test(item.MimeType) || (collection && collection.isAssignment(id));

			const render = isAssignment
				? Boolean(collection && collection.getAssignment(id))
				: true; // Quizes always render.

			return render;
		}
	},


	propTypes: {
		item: React.PropTypes.object,
		node: React.PropTypes.instanceOf(OutlineNode),
		assessmentCollection: React.PropTypes.object
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
		let {node, item, assessmentCollection} = this.props;
		let ntiid = getID(item);
		let assignment = assessmentCollection.getAssignment(ntiid, node.getContentId());
		let isAssignment = assignment || assignmentType.test(item.MimeType);

		this.setState({assignment: assignment, loading: true});

		let work;

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
			this.setAssignmentHref();

			work = loadPreviousState(assignment)
				.then(this.setAssignmentHistory)
				.catch(this.maybeNetworkError)
				.catch(this.setNotTaken);
		}

		work.then(()=>this.setState({loading: false}), ()=> {});
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
			this.setState({networkError: true});
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


	setAssignmentHref () {
		let ntiid = getID(this.props.item);
		// The '..' in the path tells "buildHref" to go up to the
		// parent router instead of our immediate parent router.
		let link = path.join('..', 'assignments', encodeForURI(ntiid)) + '/';
		this.setState({href: this.buildHref(link)});
	},


	setQuizHref () {
		let ntiid = getID(this.props.item);
		let link = path.join(this.getPath(), 'content', encodeForURI(ntiid)) + '/';
		this.setState({href: this.buildHref(link)});
	},


	render () {
		let state = this.state;
		let item = this.props.item;
		let questionCount = getQuestionCount(item);
		let label = item.label || item.title;

		//let latestAttempt = state.latestAttempt;
		let assignment = state.assignment;
		let assignmentHistory = state.assignmentHistory;

		// let due = assignment && assignment.getDueDate();

		let score = state.score || 0;

		let isLate = assignment && !assignment.isNonSubmit() && assignment.isLate(new Date());

		let classList = cx('overview-naquestionset', {
			networkerror: state.networkError,
			loading: state.loading,
			completed: state.completed,
			late: isLate,
			assignment: assignment,
			assessment: !assignment,
			submitted: assignmentHistory && assignmentHistory.isSubmitted()
		});

		return (
			<a className={classList} href={state.href}>
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
