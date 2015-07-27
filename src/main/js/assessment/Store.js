import emptyFunction from 'react/lib/emptyFunction';

import hasValue from 'nti.lib.interfaces/utils/object-has-value';

import {getModel} from 'nti.lib.interfaces';

import {
	BUSY_LOADING,
	BUSY_SUBMITTING,
	BUSY_SAVEPOINT,
	SYNC,
	SUBMIT_BEGIN,
	SUBMIT_END,
	RESET,
	INTERACTED,
	CLEAR,
	ERROR
} from './Constants';
import {
	isAssignment,
	getMainSubmittable,
	updatePartsWithAssessedParts
} from './Utils';

import StorePrototype from 'common/StorePrototype';


let AssignmentHistoryItem = getModel('assessment.assignmenthistoryitem');
let Question = getModel('question');


// const data = Symbol('data');
const ApplySubmission = Symbol('apply:Submission');
const GetAssessmentKey = Symbol('get:AssessmentKey');
const OnClear = Symbol('on:Clear');
const OnInteracted = Symbol('on:Interacted');
const OnReset = Symbol('on:Submit:Reset');
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

class Store extends StorePrototype {

	constructor () {
		super();
		this.setMaxListeners(0);
		this.registerHandlers({
			[SUBMIT_BEGIN]: OnSubmitStart,
			[SUBMIT_END]: OnSubmitEnd,
			[CLEAR]: OnClear,
			[RESET]: OnReset,
			[INTERACTED]: OnInteracted
		});

		this.assignmentHistoryItems = {};
		this.assessed = {};
		this.data = {};
		this.busy = {};
		this.timers = { start: new Date(), lastQuestionInteraction: null };
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
			this.setError(assessment, response.message || 'An error occurred.');
			this.markBusy(assessment, false);
			return;
		}

		if (!isIndividual) {
			scrollTo(0, 0);
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
			let reloadAnswers = !isAssignment(assessment);
			this.setupAssessment(assessment, reloadAnswers)
				.then(() => {
					this[SaveProgress](assessment, 1);
					this.emitChange({type: SYNC});
				});
		}
		this.emitChange({type: RESET});
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

		console.debug('Question Part Interacted: %o', action);

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


	[SaveProgress](part, buffer = 1000) {
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

		let schedual = (buffer) ?
			fn=>setTimeout(fn, buffer) :	//schedual a task in the future
			busyState ?
				()=>0 :						//drop on the floor
				fn=>(fn() && 0);			//execute task immediately

		this.savepointDelay = schedual(() => {
			this.markBusy(part, BUSY_SAVEPOINT);
			this.emitChange({type: BUSY_SAVEPOINT});

			saveProgress(part)//eslint-disable-line no-use-before-define
				.catch(emptyFunction)//handle errors
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
		let item = this.getAssignmentHistoryItem(assessment);
		return item && item.Feedback;
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


	teardownAssessment (assessment) {
		let m = this[GetAssessmentKey](assessment);
		if (m) {
			delete this.assignmentHistoryItems[m];
			delete this.assessed[m];
			delete this.timers[m];//TODO: iterate and clearTimeout/clearInterval each.
			delete this.data[m];
		}
	}


	setupAssessment (assessment, loadProgress, administrative) {
		let main = getMainSubmittable(assessment);
		if (!main) {
			return;
		}
		console.debug('New Assessment: %o', main);

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

		if (!loadProgress || administrative) {
			return Promise.resolve();
		}

		this.markBusy(assessment, BUSY_LOADING);
		this.emitChange({type: BUSY_LOADING});



		return loadPreviousState(assessment)//eslint-disable-line no-use-before-define
			.then(this[ApplySubmission].bind(this, assessment))

			.catch(reason => {
				if (reason && reason.statusCode !== 404) {
					console.error('Could not load previous state: %o', reason);
				}

				return void undefined;
			})

			.then(type => {
				type = type || BUSY_LOADING;
				this.clearBusy(assessment);
				this.emitChange({type});
			});

	}


	[ApplySubmission] (assessment, submission) {
		let key = this[GetAssessmentKey](assessment);
		let s = this.getSubmissionData(assessment);
		let questions = submission.getQuestions ? submission.getQuestions() : [submission];
		let assessedUnit = null;

		s.CreatorRecordedEffortDuration = submission.CreatorRecordedEffortDuration;

		questions.forEach(q => {

			let question = getQuestion(s, q.getID());
			if(!question) {
				console.warn('Previous attempt question not found in current question set');
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


	isWordBankEntryUsed(wordBankEntry) {
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
}


export default new Store();

//we need to export our store instance before we can import Api, which
//imports the Store. (otherwise, Api's reference to the store will be undefined)
import {loadPreviousState, saveProgress} from './Api';
