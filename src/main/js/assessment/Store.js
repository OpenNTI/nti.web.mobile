'use strict';
/** @module assessment/Store */

var EventEmitter = require('events').EventEmitter;

var AppDispatcher = require('dispatcher/AppDispatcher');
var CHANGE_EVENT = require('common/constants/Events').CHANGE_EVENT;

var Constants = require('./Constants');

var data = {};


function getMainSubmittable(o){
	var p;
	do {
		p = o && o.up('getSubmission');
		if (p) { o = p; }
	} while (p);
	return o;
}


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


	setupAssessment: function (assessment) {
		var main = getMainSubmittable(assessment);
		if (!main) {return;}
		console.debug('New Assessment: %o', main);

		data[assessment.getID()] = main.getSubmission();
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
		return s && s.canSubmit();
	},


	getPartValue: function (part) {
		var main = getMainSubmittable(part);
		var s = data[main.getID()];
		var question = s && part && s.getQuestion(part.getQuestionId());
		return question.getPartValue(part.getPartIndex());
	}
});


function onInteraction(part, value) {
	var main = getMainSubmittable(part);
	var s = main && data[main.getID()];
	var question = s && part && s.getQuestion(part.getQuestionId());

	question.setPartValue(part.getPartIndex(), value);
}


AppDispatcher.register(function(payload) {
	var action = payload.action;
	var eventData;
	switch(action.type) {
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
