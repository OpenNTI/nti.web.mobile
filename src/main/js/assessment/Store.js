import { Models } from '@nti/lib-interfaces';
import Logger from '@nti/util-logger';
import StorePrototype from '@nti/lib-store';

import {loadPreviousState, saveProgress} from './Api';
import {
	BUSY_LOADING,
	BUSY_SUBMITTING,
	BUSY_SAVEPOINT,
	SYNC,
	SUBMIT_BEGIN,
	SUBMIT_END,
	RESET,
	ASSIGNMENT_RESET,
	INTERACTED,
	CLEAR,
	ERROR,
	TOGGLE_AGGREGATED_VIEW
} from './Constants';
import {
	isAssignment,
	isSurvey,
	getMainSubmittable,
	updatePartsWithAssessedParts
} from './utils';


const logger = Logger.get('assessment:store');

const {
	assignment:{
		AssignmentHistoryItem
	},
	Question
} = Models.assessment;


// const data = Symbol('data');
const ApplySubmission = Symbol('apply:Submission');
const GetAssessmentKey = Symbol('get:AssessmentKey');
const OnAggregationToggle = Symbol('Toggle Aggregation');
const OnClear = Symbol('on:Clear');
const OnInteracted = Symbol('on:Interacted');
const OnReset = Symbol('on:Submit:Reset');
const OnAssignmentReset = Symbol('on:Assignment:Reset');
const OnSubmitStart = Symbol('on:Submit:Begin');
const OnSubmitEnd = Symbol('on:Submit:End');
const SaveProgress = Symbol('Save Progress');

function getQuestion (thing, part) {
	let id = part && (part.getQuestionId ?
		part.getQuestionId() :
		(typeof part === 'string' ?
			part :
			null));

	if (id == null) {
		throw new Error('Unknown question id');
	}
	return thing && (
		thing.getQuestion ?
			thing.getQuestion(id) :
			thing
	);
}


function hasValue (obj, v) {
	return obj && Object.values(obj).indexOf(v) > -1;
}


class Store extends StorePrototype {

	constructor () {
		super();
		this.setMaxListeners(100);
		this.registerHandlers({
			[SUBMIT_BEGIN]: OnSubmitStart,
			[SUBMIT_END]: OnSubmitEnd,
			[CLEAR]: OnClear,
			[RESET]: OnReset,
			[INTERACTED]: OnInteracted,
			[TOGGLE_AGGREGATED_VIEW]: OnAggregationToggle,
			[ASSIGNMENT_RESET]: OnAssignmentReset
		});

		this.assignmentHistoryItems = {};
		this.assessed = {};
		this.active = {};
		this.data = {};
		this.busy = {};
		this.timers = { start: new Date(), lastQuestionInteraction: null };
	}


	[OnAggregationToggle] (payload) {
		let {assessment} = payload.action;

		const state = this.aggregationViewState(assessment);
		this.aggregationViewState(assessment, !state, true);

		this.emitChange({type: SYNC});
	}


	[OnSubmitStart] (payload) {
		let {assessment} = payload.action;
		clearTimeout(this.savepointDelay);
		this.markBusy(assessment, BUSY_SUBMITTING);
		this.emitChange({type: SUBMIT_BEGIN});
	}


	[OnSubmitEnd] (payload) {
		let {response, assessment} = payload.action;
		let isError = !!response.statusCode;
		let isIndividual = assessment && assessment.individual;

		if (isError) {
			this.setError(assessment, response);
			this.markBusy(assessment, false);
			this.emitChange({type: SUBMIT_END});
			return;
		}

		if (!isIndividual) {
			global.scrollTo(0, 0);
		}

		this[ApplySubmission](assessment, response);
		this.getSubmissionData(assessment).markSubmitted(true);
		this.markBusy(assessment, false);
		this.emitChange({type: SYNC});
	}


	[OnClear] (payload) {
		let {assessment} = payload.action;
		this.setupAssessment(assessment, false)
			.then(()=>this[SaveProgress](assessment, 1));
		this.emitChange({type: SYNC});
	}


	[OnReset] (payload) {
		let {assessment, retainAnswers} = payload.action;

		if (retainAnswers) {
			this.getSubmissionData(assessment).markSubmitted(false);
		} else {
			let reloadAnswers = !isAssignment(assessment) && !isSurvey(assessment);
			this.setupAssessment(assessment, reloadAnswers)
				.then(() => {
					this[SaveProgress](assessment, 1);
					this.emitChange({type: SYNC});
				});
		}
		this.emitChange({type: RESET});
	}

	[OnAssignmentReset] (payload) {
		const {assignment} = payload.action;
		const key = this[GetAssessmentKey](assignment);

		delete this.assignmentHistoryItems[key];
		delete this.data[key];
		delete this.assessed[key];

		this.setupAssessment(assignment)
			.then(() => {
				this.emitChange({type: ASSIGNMENT_RESET});
				this.emitChange({type: SYNC});
			});
	}


	[OnInteracted] (payload) {
		let {action} = payload;
		let {part, value, savepointBuffer} = action;

		let key = this[GetAssessmentKey](part);
		let s = this.data[key];
		let question = getQuestion(s, part);

		if (this.isAdministrative(part)) {
			return;
		}

		// logger.debug('Question Part Interacted: %o', action);

		let interactionTime = new Date();
		let time = this.timers[key] || {};
		let duration = interactionTime - (time.lastQuestionInteraction || time.start || new Date());

		time.lastQuestionInteraction = interactionTime;

		question.addRecordedEffortTime(duration);

		question.setPartValue(part.getPartIndex(), value);

		this.clearError(part);

		this[SaveProgress](part, savepointBuffer);

		this.emitChange({type: INTERACTED});
	}


	[GetAssessmentKey] (assessment) {
		let main = getMainSubmittable(assessment) || false;
		return main && main.getID();
	}


	[SaveProgress] (part, buffer = 1000) {
		let main = getMainSubmittable(part);
		if (!main.postSavePoint) {
			return;
		}

		clearTimeout(this.savepointDelay);

		let busyState = this.getBusyState(part);
		//Do not attempt to make a save point if:
		//	A) Submitted
		// or
		//	B) Busy Submitting
		if (this.isSubmitted(part) || (busyState && busyState === BUSY_SUBMITTING)) {
			return;
		}

		let schedule = (buffer) ?
			fn=>setTimeout(fn, buffer) :	//schedule a task in the future
			busyState ?
				()=>0 :						//drop on the floor
				fn=>(fn() && 0);			//execute task immediately

		this.savepointDelay = schedule(() => {
			this.markBusy(part, BUSY_SAVEPOINT);
			this.emitChange({type: BUSY_SAVEPOINT});

			saveProgress(part)
				.catch(e => {
					//handle errors
					logger.warn('Error Saving Progress: %o', e);
					if (e.statusCode === 409) {
						this.setError (part, e);
					}
				})
				.then(() => {
					this.markBusy(part, false);
					this.emitChange({type: BUSY_SAVEPOINT});
				});
		});
	}


	markBusy (part, state) {
		let main = getMainSubmittable(part);
		let id = main && main.getID();

		this.busy[id] = state;
		if (!state) {
			delete this.busy[id];
		}
	}


	getSubmissionData (assessment) {
		return this.data[this[GetAssessmentKey](assessment)];
	}


	getSubmissionPreparedForPost (assessment) {
		let d = this.getSubmissionData(assessment);
		let times, v, now = new Date();

		//Assignments and QuestionSets, record aggregate effort time. (questions record themselves. See: onInteraction)
		if (d && d.getQuestions) {
			times = this.timers[this[GetAssessmentKey](assessment)] || {start: now};
			v = d.CreatorRecordedEffortDuration || 0;
			d.CreatorRecordedEffortDuration = v + (now - times.start);
		}

		return d;
	}


	getAssignmentFeedback (assessment) {
		const item = this.getAssignmentHistoryItem(assessment);
		if (item && !item.Feedback) {
			return item.refresh().then(()=> item.Feedback);
		}
		return Promise.resolve(item && item.Feedback);
	}


	getAssignmentHistoryItem (assessment) {
		return this.assignmentHistoryItems[this[GetAssessmentKey](assessment)];
	}


	getAssessedSubmission (assessment) {
		return this.assessed[this[GetAssessmentKey](assessment)];
	}


	getAssessedQuestion (assessment, questionId) {
		let submission = this.getAssessedSubmission(assessment);
		//If its an AssessedQuestionSet, it has a getQuestion method.
		let getter = submission && submission.getQuestion;

		//resolve down to the AssessedQuestion
		let question = getter ? getter.call(submission, questionId) : submission;

		return question && question.getID() === questionId ? question : undefined;
	}


	getAssessmentQuestion (questionId) {
		function find (found, item) {
			return found || (
				//Find in Assignments/QuestionSets
				(//or find the top-level question:
					item.getQuestion && item.getQuestion(questionId) || item.getID() === questionId && item)
			);
		}
		return Object.values(this.active).reduce(find, null);
	}


	isActive (assessment) {
		const key = this[GetAssessmentKey](assessment);
		return Boolean(this.active[key]);
	}


	teardownAssessment (assessment) {
		let m = this[GetAssessmentKey](assessment);
		if (m) {
			delete this.aggregateView;
			delete this.active[m];
			delete this.assignmentHistoryItems[m];
			delete this.assessed[m];
			delete this.timers[m];//TODO: iterate and clearTimeout/clearInterval each.
			delete this.data[m];
		}
	}


	setupAssessment (assessment, progress, administrative) {
		let main = getMainSubmittable(assessment);
		if (!main) {
			return;
		}
		logger.debug('New Assessment: %o', main);

		this.active[main.getID()] = main;
		this.assessed[main.getID()] = null;

		let data = main.getSubmission();
		this.data[main.getID()] = data;
		if (administrative) {
			data.isAdministrative = true;
		}

		this.timers[main.getID()] = {
			start: new Date(),
			lastQuestionInteraction: null
		};

		if (!progress) {
			return Promise.resolve();
		}


		this.markBusy(assessment, BUSY_LOADING);
		this.emitChange({type: BUSY_LOADING});

		const load = typeof progress === 'object'
			? Promise.resolve(progress)
			: loadPreviousState(assessment); //eslint-disable-line no-use-before-define

		return load
			.then(submission => this[ApplySubmission](assessment, submission))

			.catch(reason => {
				if (reason && reason.statusCode !== 404) {
					logger.error('Could not load previous state: %o', reason);
				}

				return void undefined;
			})

			.then(type => {
				type = type || SYNC;
				this.clearBusy(assessment);
				this.emitChange({type});
			});

	}


	[ApplySubmission] (assessment, container) {
		let key = this[GetAssessmentKey](assessment);
		let s = this.getSubmissionData(assessment);

		let submission = container;

		if(container.getMostRecentHistoryItem) {
			submission = container.getMostRecentHistoryItem();
		}

		let questions = submission.getQuestions ? submission.getQuestions() : [submission];
		let assessedUnit = null;

		s.CreatorRecordedEffortDuration = submission.CreatorRecordedEffortDuration;

		questions.forEach(q => {

			let question = getQuestion(s, q && q.getID());
			if(!question) {
				logger.warn('Previous attempt question not found in current question set');
				return;
			}

			question.CreatorRecordedEffortDuration = q.CreatorRecordedEffortDuration;

			let parts = q.parts;
			let partCount = parts.length;
			let x, p;

			for (x = 0; x < partCount; x++) {
				p = parts[x];
				if (p && p.isCorrect) {
					if (!assessedUnit) {
						assessedUnit = p.getAssessedRoot();
					}
					p = p.submittedResponse;
				}
				question.setPartValue(x, p);
			}
		});

		this.assessed[key] = assessedUnit;

		//This modifies `assessment`. The solutions, explanations, and any value that could help a student
		// cheat are omitted until submitting.
		if (assessedUnit) {
			updatePartsWithAssessedParts(assessment, submission);
		}

		if (submission instanceof AssignmentHistoryItem) {
			this.assignmentHistoryItems[key] = submission;
		}

		s.markSubmitted(submission.isSubmitted());
		//s.specifySubmissionResetPolicy(submission.canReset());

		return SYNC;
	}


	clearBusy (assessment) {
		if (this.getBusyState(assessment) === BUSY_LOADING) {
			this.markBusy(assessment, false);
		}
	}


	countUnansweredQuestions (assessment) {
		let main = getMainSubmittable(assessment);
		let s = this.getSubmissionData(assessment);
		return s && s.countUnansweredQuestions(main);
	}


	canReset (assessment) {
		let s = this.getSubmissionData(assessment);
		return !this.getBusyState(assessment) && s && s.canReset ? s.canReset() : true;
	}


	canSubmit (assessment) {
		let s = this.getSubmissionData(assessment);
		let admin = this.isAdministrative(assessment);
		return !this.getBusyState(assessment) && !admin && s && s.canSubmit();
	}


	isSubmitted (assessment) {
		let main = getMainSubmittable(assessment);
		let s = this.getSubmissionData(assessment);

		if (main.IsTimedAssignment /*&& !main.isStarted()*/) {
			return false;
		}

		return s && s.isSubmitted();
	}


	getBusyState (part) {
		return this.busy[this[GetAssessmentKey](part)];
	}


	getPartValue (part) {
		let s = this.getSubmissionData(part);
		let question = getQuestion(s, part);
		return question && question.getPartValue(part.getPartIndex());
	}


	getError (part) {
		let s = this.getSubmissionData(part) || {};
		return s.error;
	}


	setError (part, error) {
		let s = this.getSubmissionData(part);
		s.error = error;
		this.emitChange({type: ERROR});
	}


	clearError (part) {
		let s = this.getSubmissionData(part);
		delete s.error;
		this.emitChange({type: ERROR});
	}


	getExplanation (part) {
		return part.explanation;
	}


	getSolution (part) {
		return (part.solutions || [])[0];
	}


	getHints (part) {
		return part.hints;
	}


	isAdministrative (part) {
		let data = this.data[this[GetAssessmentKey](part)];
		return Boolean(data && data.isAdministrative);
	}


	isWordBankEntryUsed (wordBankEntry) {
		let {wid} = wordBankEntry;
		let submission = this.getSubmissionData(wordBankEntry);
		let question = wordBankEntry.parent('constructor', {test: x=>x === Question});

		let maybe, parts;
		if (question && submission) {
			question = getQuestion(submission, question.getID()) || {};
			parts = question.parts || [];

			maybe = parts.reduce((yes, part)=>yes || hasValue(part, wid), false);
		}

		return maybe;
	}


	aggregationViewState (assessment, defaultValue, forceUpdate) {
		const key = this[GetAssessmentKey](assessment);
		const survey = getMainSubmittable(assessment);
		if (!survey.hasAggregationData) {
			return false;
		}

		if (!this.aggregateView) {
			this.aggregateView = {};
		}

		if (!(key in this.aggregateView) || forceUpdate) {
			if (defaultValue == null) {
				defaultValue = this.isSubmitted(assessment) || survey.hasReport;
			}

			//this should just return the defaultValue... but to "toggle" correctly we need an initial value.
			this.aggregateView[key] = defaultValue;
		}

		return this.aggregateView[key];
	}
}


export default new Store();
