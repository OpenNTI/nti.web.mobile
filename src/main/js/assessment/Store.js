'use strict';
/** @module assessment/Store */

var emptyFunction = require('react/lib/emptyFunction');

var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('dispatcher/AppDispatcher');
var CHANGE_EVENT = require('common/constants/Events').CHANGE_EVENT;

var hasValue = require('dataserverinterface/utils/object-has-value');
var Question = require('dataserverinterface/models/assessment/Question');
var AssessedPart = require('dataserverinterface/models/assessment/AssessedPart');
var AssignmentHistoryItem = require('dataserverinterface/models/assessment/AssignmentHistoryItem');

var Constants = require('./Constants');
var Api = require('./Api');
var Utils = require('./Utils');

var savepointDelay;

var assignmentHistoryItems = {};
var assessed = {};
var data = {};
var busy = {};
var timers = {
	start: new Date(),
	lastQuestionInteraction: null
};


var Store = Object.assign({}, EventEmitter.prototype, {
	displayName: 'assessment.Store',
	_maxListeners: 0, //unlimited

	isAssignment: Utils.isAssignment.bind(Utils),

	emitChange: function(evt) {
		this.emit(CHANGE_EVENT, evt);
	},


	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},


	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},


	__getAssessmentKey: function (assessment) {
		var main = Utils.getMainSubmittable(assessment) || false;
		return main && main.getID();
	},


	getSubmissionData: function (assessment) {
		return data[this.__getAssessmentKey(assessment)];
	},


	getSubmissionPreparedForPost: function (assessment) {
		var d = this.getSubmissionData(assessment);
		var times, v, now = new Date();

		//Assignments and QuestionSets, record aggregate effort time. (questions record themselves. See: onInteraction)
		if (d && d.getQuestions) {
			times = timers[this.__getAssessmentKey(assessment)] || {start: now};
			v = d.CreatorRecordedEffortDuration || 0;
			d.CreatorRecordedEffortDuration = v + (now - times.start);
		}

		return d;
	},


	getAssignmentHistoryItem: function (assessment) {
		return assignmentHistoryItems[this.__getAssessmentKey(assessment)];
	},


	getAssessedSubmission: function (assessment) {
		return assessed[this.__getAssessmentKey(assessment)];
	},


	getAssessedQuestion: function (assessment, questionId) {
		var submission = this.getAssessedSubmission(assessment);
		//If its an AssessedQuestionSet, it has a getQuestion method.
		var getter = submission && submission.getQuestion;

		//resolve down to the AssessedQuestion
		var question = getter ? getter.call(submission, questionId) : submission;

		return question && question.getID() === questionId ? question : undefined;
	},


	teardownAssessment: function (assessment) {
		var m = this.__getAssessmentKey(assessment);
		if (m) {
			delete assignmentHistoryItems[m];
			delete assessed[m];
			delete timers[m];
			delete data[m];
		}
	},


	setupAssessment: function (assessment, loadProgress) {
		var main = Utils.getMainSubmittable(assessment);
		if (!main) {return;}
		console.debug('New Assessment: %o', main);

		assessed[main.getID()] = null;
		data[main.getID()] = main.getSubmission();
		timers[main.getID()] = {
			start: new Date(),
			lastQuestionInteraction: null
		};

		if (!loadProgress) {return;}

		markBusy(assessment, Constants.BUSY.LOADING);
		this.emitChange();



		Api.loadPreviousState(assessment)
			.then(this.__applySubmission.bind(this, assessment))

			.catch(reason => {
				if (reason) {
					console.error('Could not load previous state: %o', reason);
				}

				return void undefined;
			})

			.then(act=>{
				this.clearBusy(assessment);
				this.emitChange(act);
			});

	},


	__applySubmission: function(assessment, submission) {
		var key = this.__getAssessmentKey(assessment);
		var s = this.getSubmissionData(assessment);
		var questions = submission.getQuestions ? submission.getQuestions() : [submission];
		var assessedUnit = null;

		s.CreatorRecordedEffortDuration = submission.CreatorRecordedEffortDuration;

		questions.forEach(q => {

			var question = s.getQuestion(q.getID());

			question.CreatorRecordedEffortDuration = q.CreatorRecordedEffortDuration;

			var parts = q.parts;
			var partCount = parts.length;
			var x, p;

			for (x = 0; x < partCount; x++) {
				p = parts[x];
				if (p && p instanceof AssessedPart) {
					if (!assessedUnit) {
						assessedUnit = p.getAssessedRoot();
					}
					p = p.submittedResponse;
				}
				question.setPartValue(x, p);
			}
		});

		assessed[key] = assessedUnit;

		//This modifies `assessment`. The solutions, explanations, and any value that could help a student
		// cheat are omitted until submitting.
		if (assessedUnit) {
			Utils.updatePartsWithAssessedParts(assessment, submission);
		}

		if (submission instanceof AssignmentHistoryItem) {
			assignmentHistoryItems[key] = submission;
		}

		s.markSubmitted(submission.isSubmitted());
		//s.specifySubmissionResetPolicy(submission.canReset());

		return Constants.SYNC;
	},


	clearBusy: function (assessment) {
		if (this.getBusyState(assessment) === Constants.BUSY.LOADING) {
			markBusy(assessment, false);
		}
	},


	countUnansweredQuestions: function(assessment){
		var s = this.getSubmissionData(assessment);
		return s && s.countUnansweredQuestions();
	},


	canSubmit: function(assessment){
		var s = this.getSubmissionData(assessment);
		return s && s.canSubmit() && !this.getBusyState(assessment);
	},


	isSubmitted: function(assessment){
		var s = this.getSubmissionData(assessment);
		return s && s.isSubmitted();
	},


	getBusyState: function(part) {
		return busy[this.__getAssessmentKey(part)];
	},


	getPartValue: function (part) {
		var s = this.getSubmissionData(part);
		var question = s && part && s.getQuestion(part.getQuestionId());
		return question.getPartValue(part.getPartIndex());
	},


	getError: function (part) {
		var s = this.getSubmissionData(part) || {};
		return s.error;
	},


	setError: function (part, error) {
		var s = this.getSubmissionData(part);
		s.error = error;
		this.emitChange();
	},


	clearError: function (part) {
		var s = this.getSubmissionData(part);
		delete s.error;
		this.emitChange();
	},


	getExplanation: function (part) {
		return part.explanation;
	},


	getSolution: function (part) {
		return (part.solutions || [])[0];
	},


	getHints: function (part) {
		return part.hints;
	},

	isWordBankEntryUsed(wordBankEntry) {
		var {wid} = wordBankEntry;
		var submission = this.getSubmissionData(wordBankEntry);
		var question = wordBankEntry.up('constructor', {test: x=>x === Question});
		var maybe, parts;
		if (question && submission) {
			question = submission.getQuestion(question.getID()) || {};
			parts = question.parts || [];

			maybe = parts.reduce((yes, part)=>yes || hasValue(part, wid), false);
		}

		return maybe;
	}
});


function handleSubmitEnd (part, response) {
	var isError = !!response.statusCode;
	if (isError) {
		Store.setError(part, response.message || 'An Error occured.');
		markBusy(part, false);
		return;
	}

	scrollTo(0, 0);

	Store.__applySubmission(part, response);
	Store.getSubmissionData(part).markSubmitted(true);
	markBusy(part, false);
}


function onInteraction(part, value) {
	var main = Utils.getMainSubmittable(part);
	var key = main && main.getID();
	var s = data[key];
	var question = s && part && s.getQuestion(part.getQuestionId());

	var interactionTime = new Date();
	var time = timers[key] || {};
	var duration = interactionTime - (time.lastQuestionInteraction || time.start || new Date());

	time.lastQuestionInteraction = interactionTime;

	question.addRecordedEffortTime(duration);

	question.setPartValue(part.getPartIndex(), value);

	Store.clearError(part);


	saveProgress(part);
}

function saveProgress(part) {
	clearTimeout(savepointDelay);
	savepointDelay = setTimeout(()=>{
	markBusy(part, Constants.BUSY.SAVEPOINT);
		Store.emitChange();
	Api.saveProgress(part)
		.catch(emptyFunction)//handle errors
		.then(() => {
			markBusy(part, false);
			Store.emitChange();
		});
	}, 1000);
}


function markBusy(part, state) {
	var main = Utils.getMainSubmittable(part);
	var id = main && main.getID();

	busy[id] = state;
	if (!state) {
		delete busy[id];
	}
}


AppDispatcher.register(function(payload) {
	var action = payload.action;
	var eventData;

	switch(action.type) {
		case Constants.SUBMIT_BEGIN:
			markBusy(action.assessment, Constants.BUSY.SUBMITTING);
			break;

		case Constants.SUBMIT_END:
			handleSubmitEnd(action.assessment, action.response);
			eventData = Constants.SYNC;
			break;

		case Constants.RESET:
			Store.setupAssessment(action.assessment);
			eventData = Constants.SYNC;
			break;


		case Constants.INTERACTED:
			console.debug('Question Part Interacted: %o',action);
			onInteraction(action.part, action.value);
			break;

		default: return true;
	}
	Store.emitChange(eventData);
	return true;
});


module.exports = Store;
