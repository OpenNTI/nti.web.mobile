'use strict';
/** @module assessment/Store */

var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('common/dispatcher/AppDispatcher');
var CHANGE_EVENT = require('common/constants/Events').CHANGE_EVENT;

var assign = require('object-assign');

var Constants = require('./Constants');


var Store = assign(EventEmitter.prototype, {
	displayName: 'assessment.Store',
	_maxListeners: 0,//unlimited


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
		console.debug('New Assessment: %o', assessment);
	},


	countUnansweredQuestions: function(assessment){
		return assessment.getQuestionCount();
	}
});


Store.appDispatch = AppDispatcher.register(function(payload) {
	var action = payload.action;
	switch(action.type) {
		case Constants.INITIALIZE_QUESTION_STATUS:
			console.debug('Question Init: %o',action);
			break;

		case Constants.INTERACTED:
			console.debug('Question Part Interacted: %o',action);
			break;

		default: return true;
	}
	Store.emitChange();
	return true;
});


module.exports = Store;
