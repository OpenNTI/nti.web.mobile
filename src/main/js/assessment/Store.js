'use strict';
/** @module assessment/Store */

var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('dispatcher/AppDispatcher');
var CHANGE_EVENT = require('common/constants/Events').CHANGE_EVENT;

var Constants = require('./Constants');
var Api = require('./Api');

var data = {};
var busy = {};

var getMainSubmittable = require('./Utils').getMainSubmittable;

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


	getSubmissionData: function (assessment) {
		var main = getMainSubmittable(assessment);
		return main && data[main.getID()];
	},


	setupAssessment: function (assessment, loadProgress) {
		var main = getMainSubmittable(assessment);
		if (!main) {return;}
		console.debug('New Assessment: %o', main);

		data[main.getID()] = main.getSubmission();

		if (!loadProgress) {return;}

		markBusy(assessment, Constants.BUSY.LOADING);
		this.emitChange();



		Api.loadPreviousState(assessment)

			.catch(function(reason) {
				if (reason) {
					console.error('Could not load save point %o', reason);
				}
				return;
			})

			.then(this.applyPreviousState.bind(this, assessment));
	},


	applyPreviousState: function(assessment, previousState) {
		var main = getMainSubmittable(assessment);
		var s = main && data[main.getID()];

		previousState.getQuestions().forEach(q => {

			var question = s.getQuestion(q.getID());

			var parts = q.parts;
			var partCount = parts.length;
			var x;

			for (x = 0; x < partCount; x++) {
				question.setPartValue(x, parts[x]);
			}
		});


		if (this.getBusyState(assessment) === Constants.BUSY.LOADING) {
			markBusy(assessment, false);
		}

		this.emitChange(Constants.SYNC);
	},


	teardownAssessment: function (assessment) {
		var m = getMainSubmittable(assessment);
		if (m) {
			m = m && m.getID();
			delete data[m];
		}
	},


	countUnansweredQuestions: function(assessment){
		var main = getMainSubmittable(assessment);
		var s = data[main.getID()];
		return s && s.countUnansweredQuestions();
	},


	canSubmit: function(assessment){
		var main = getMainSubmittable(assessment);
		var s = data[main.getID()];
		return s && s.canSubmit() && !this.getBusyState(assessment);
	},


	getBusyState: function(part) {
		var main = getMainSubmittable(part);
		return main && busy[main.getID()];
	},


	getPartValue: function (part) {
		var main = getMainSubmittable(part);
		var s = data[main.getID()];
		var question = s && part && s.getQuestion(part.getQuestionId());
		return question.getPartValue(part.getPartIndex());
	},


	getError: function (part) {
		var main = getMainSubmittable(part);
		var s = data[main.getID()];
		return s.error;
	},


	setError: function (part, error) {
		var main = getMainSubmittable(part);
		var s = data[main.getID()];
		s.error = error;
		this.emitChange();
	},


	clearError: function (part) {
		var main = getMainSubmittable(part);
		var s = data[main.getID()];
		delete s.error;
		this.emitChange();
	}

});


function handleSubmitEnd (part, response) {
	var isError = !!response.statusCode;
	if (isError) {
		Store.setError(part, response.message || 'An Error occured.');
		return;
	}

	debugger;
}


function onInteraction(part, value) {
	var main = getMainSubmittable(part);
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
	var main = getMainSubmittable(part);
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
			markBusy(action.assessment, false);
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
