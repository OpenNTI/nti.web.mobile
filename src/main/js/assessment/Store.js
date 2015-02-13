import emptyFunction from 'react/lib/emptyFunction';

import hasValue from 'dataserverinterface/utils/object-has-value';

import {getModel} from 'dataserverinterface';

import {
	BUSY_LOADING,
	BUSY_SUBMITTING,
	BUSY_SAVEPOINT,
	BUSY_SUBMITTING,
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


var AssignmentHistoryItem = getModel('assessment.assignmenthistoryitem');
var Question = getModel('question');


// const data = Symbol('data');
const ApplySubmission = Symbol('apply:Submission');
const GetAssessmentKey = Symbol('get:AssessmentKey');
const OnClear = Symbol('on:Clear');
const OnInteracted = Symbol('on:Interacted');
const OnReset = Symbol('on:Submit:Reset');
const OnSubmitStart = Symbol('on:Submit:Begin');
const OnSubmitEnd = Symbol('on:Submit:End');
const SaveProgress = Symbol('Save Progress');

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
		var {assessment} = payload.action;
		clearTimeout(this.savepointDelay);
		this.markBusy(assessment, BUSY_SUBMITTING);
		this.emitChange({type: SUBMIT_BEGIN});
	}


	[OnSubmitEnd] (payload) {
		var {response, assessment} = payload.action;
		var isError = !!response.statusCode;
		if (isError) {
			this.setError(assessment, response.message || 'An Error occured.');
			this.markBusy(assessment, false);
			return;
		}

		scrollTo(0, 0);

		Store[ApplySubmission](assessment, response);
		this.getSubmissionData(assessment).markSubmitted(true);
		this.markBusy(assessment, false);
		this.emitChange({type: SYNC});
	}


	[OnClear] (payload) {
		var {assessment} = payload.action;
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
				.then(()=>{
					this[SaveProgress](assessment, 1);
					this.emitChange({type: SYNC});
				});
		}
		this.emitChange({type: RESET});
	}


	[OnInteracted] (payload) {
		let {action} = payload;
		let {part, value, savepointBuffer} = action;

		console.debug('Question Part Interacted: %o', action);

		var main = getMainSubmittable(part);
		var key = main && main.getID();
		var s = this.data[key];
		var question = s && part && s.getQuestion(part.getQuestionId());

		var interactionTime = new Date();
		var time = this.timers[key] || {};
		var duration = interactionTime - (time.lastQuestionInteraction || time.start || new Date());

		time.lastQuestionInteraction = interactionTime;

		question.addRecordedEffortTime(duration);

		question.setPartValue(part.getPartIndex(), value);

		this.clearError(part);

		this[SaveProgress](part, savepointBuffer);

		this.emitChange({type: INTERACTED});
	}


	[GetAssessmentKey] (assessment) {
		var main = getMainSubmittable(assessment) || false;
		return main && main.getID();
	}


	[SaveProgress](part, buffer = 1000) {
		var main = getMainSubmittable(part);
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

		this.savepointDelay = schedual(()=>{
			this.markBusy(part, BUSY_SAVEPOINT);
			this.emitChange({type: BUSY_SAVEPOINT});

			saveProgress(part)
				.catch(emptyFunction)//handle errors
				.then(() => {
					this.markBusy(part, false);
					this.emitChange({type: BUSY_SAVEPOINT});
				});
		});
	}


	markBusy (part, state) {
		var main = getMainSubmittable(part);
		var id = main && main.getID();

		this.busy[id] = state;
		if (!state) {
			delete this.busy[id];
		}
	}


	getSubmissionData (assessment) {
		return this.data[this[GetAssessmentKey](assessment)];
	}


	getSubmissionPreparedForPost (assessment) {
		var d = this.getSubmissionData(assessment);
		var times, v, now = new Date();

		//Assignments and QuestionSets, record aggregate effort time. (questions record themselves. See: onInteraction)
		if (d && d.getQuestions) {
			times = this.timers[this[GetAssessmentKey](assessment)] || {start: now};
			v = d.CreatorRecordedEffortDuration || 0;
			d.CreatorRecordedEffortDuration = v + (now - times.start);
		}

		return d;
	}


	getAssignmentFeedback (assessment) {
		var item = this.getAssignmentHistoryItem(assessment);
		return item && item.Feedback;
	}


	getAssignmentHistoryItem (assessment) {
		return this.assignmentHistoryItems[this[GetAssessmentKey](assessment)];
	}


	getAssessedSubmission (assessment) {
		return this.assessed[this[GetAssessmentKey](assessment)];
	}


	getAssessedQuestion (assessment, questionId) {
		var submission = this.getAssessedSubmission(assessment);
		//If its an AssessedQuestionSet, it has a getQuestion method.
		var getter = submission && submission.getQuestion;

		//resolve down to the AssessedQuestion
		var question = getter ? getter.call(submission, questionId) : submission;

		return question && question.getID() === questionId ? question : undefined;
	}


	teardownAssessment (assessment) {
		var m = this[GetAssessmentKey](assessment);
		if (m) {
			delete this.assignmentHistoryItems[m];
			delete this.assessed[m];
			delete this.timers[m];//TODO: iterate and clearTimeout/clearInterval each.
			delete this.data[m];
		}
	}


	setupAssessment (assessment, loadProgress) {
		var main = getMainSubmittable(assessment);
		if (!main) {return;}
		console.debug('New Assessment: %o', main);

		this.assessed[main.getID()] = null;
		this.data[main.getID()] = main.getSubmission();
		this.timers[main.getID()] = {
			start: new Date(),
			lastQuestionInteraction: null
		};

		if (!loadProgress) {return Promise.resolve();}

		this.markBusy(assessment, BUSY_LOADING);
		this.emitChange({type:BUSY_LOADING});



		return loadPreviousState(assessment)
			.then(this[ApplySubmission].bind(this, assessment))

			.catch(reason => {
				if (reason && reason.statusCode !== 404) {
					console.error('Could not load previous state: %o', reason);
					return Promise.reject(reason);
				}

				return void undefined;
			})

			.then(type=>{
				type = type || BUSY_LOADING;
				this.clearBusy(assessment);
				this.emitChange({type});
			});

	}


	[ApplySubmission] (assessment, submission) {
		var key = this[GetAssessmentKey](assessment);
		var s = this.getSubmissionData(assessment);
		var questions = submission.getQuestions ? submission.getQuestions() : [submission];
		var assessedUnit = null;

		s.CreatorRecordedEffortDuration = submission.CreatorRecordedEffortDuration;

		questions.forEach(q => {

			var question = s.getQuestion(q.getID());
			if(!question) {
				console.warn('Previous attempt question not found in current question set');
				return;
			}

			question.CreatorRecordedEffortDuration = q.CreatorRecordedEffortDuration;

			var parts = q.parts;
			var partCount = parts.length;
			var x, p;

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


	countUnansweredQuestions (assessment){
		var main = getMainSubmittable(assessment);
		var s = this.getSubmissionData(assessment);
		return s && s.countUnansweredQuestions(main);
	}


	canSubmit (assessment){
		var s = this.getSubmissionData(assessment);
		return s && s.canSubmit() && !this.getBusyState(assessment);
	}


	isSubmitted (assessment){
		var main = getMainSubmittable(assessment);
		var s = this.getSubmissionData(assessment);

		if (main.IsTimedAssignment /*&& !main.isStarted()*/) {
			return false;
		}

		return s && s.isSubmitted();
	}


	getBusyState (part) {
		return this.busy[this[GetAssessmentKey](part)];
	}


	getPartValue (part) {
		var s = this.getSubmissionData(part);
		var question = s && part && s.getQuestion(part.getQuestionId());
		return question.getPartValue(part.getPartIndex());
	}


	getError (part) {
		var s = this.getSubmissionData(part) || {};
		return s.error;
	}


	setError (part, error) {
		var s = this.getSubmissionData(part);
		s.error = error;
		this.emitChange({type: ERROR});
	}


	clearError (part) {
		var s = this.getSubmissionData(part);
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


	isWordBankEntryUsed(wordBankEntry) {
		var {wid} = wordBankEntry;
		var submission = this.getSubmissionData(wordBankEntry);
		var question = wordBankEntry.parent('constructor', {test: x=>x === Question});

		var maybe, parts;
		if (question && submission) {
			question = submission.getQuestion(question.getID()) || {};
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
