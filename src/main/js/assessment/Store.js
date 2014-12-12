'use strict';
/** @module assessment/Store */

var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('dispatcher/AppDispatcher');
var CHANGE_EVENT = require('common/constants/Events').CHANGE_EVENT;

var AssessedPart = require('dataserverinterface/models/assessment/AssessedPart');

var Constants = require('./Constants');
var Api = require('./Api');
var Utils = require('./Utils');

var assessed = {};
var data = {};
var busy = {};


var Store = Object.assign({}, EventEmitter.prototype, {
	displayName: 'assessment.Store',
	_maxListeners: 0, //unlimited

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


	getAssessedSubmission: function (assessment) {
		return assessed[this.__getAssessmentKey(assessment)];
	},


	isAssignment: function (assessment) {
		var main = Utils.getMainSubmittable(assessment) || false;
		return main && /assignment/i.test(main.MimeType || main.Class);
	},


	setupAssessment: function (assessment, loadProgress) {
		var main = Utils.getMainSubmittable(assessment);
		if (!main) {return;}
		console.debug('New Assessment: %o', main);

		assessed[main.getID()] = null;
		data[main.getID()] = main.getSubmission();

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

		questions.forEach(q => {

			var question = s.getQuestion(q.getID());

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
		Utils.updatePartsWithAssessedParts(assessment, submission);

		s.markSubmitted(submission.isSubmitted());
		//s.specifySubmissionResetPolicy(submission.canReset());

		return Constants.SYNC;
	},


	clearBusy: function (assessment) {
		if (this.getBusyState(assessment) === Constants.BUSY.LOADING) {
			markBusy(assessment, false);
		}
	},


	teardownAssessment: function (assessment) {
		var m = this.__getAssessmentKey(assessment);
		if (m) {
			delete data[m];
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
	}

});


function handleSubmitEnd (part, response) {
	var isError = !!response.statusCode;
	if (isError) {
		Store.setError(part, response.message || 'An Error occured.');
		return;
	}

	scrollTo(0, 0);

	Store.__applySubmission(part, response);
	Store.getSubmissionData(part).markSubmitted(true);
	markBusy(part, false);
}


function onInteraction(part, value) {
	var main = Utils.getMainSubmittable(part);
	var s = main && data[main.getID()];
	var question = s && part && s.getQuestion(part.getQuestionId());

	question.setPartValue(part.getPartIndex(), value);

	Store.clearError(part);

	markBusy(part, Constants.BUSY.SAVEPOINT);
	Api.saveProgress(part)
		.catch(function() {})//handel errors
		.then(function() {
			markBusy(part, false);
			Store.emitChange();
		});
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
