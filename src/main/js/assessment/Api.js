'use strict';

var ReadOnlyStore = require('./Store');
var Utils = require('./Utils');

var isHistoryItem = RegExp.prototype.test.bind(/AssignmentHistoryItem/i);

Object.assign(exports, {

	loadPreviousState: function (assessment) {
		var main = Utils.getMainSubmittable(assessment);
		var load;

		if (main && main.loadPreviousSubmission) {
			load = main.loadPreviousSubmission();
		}

		return load || Promise.reject('Nothing to do');
	},


	saveProgress: function (assessment) {
		var main = Utils.getMainSubmittable(assessment);
		var progress = ReadOnlyStore.getSubmissionPreparedForPost(assessment);

		if (!main || !main.postSavePoint) {
			return Promise.reject('Nothing to do.');
		}

		return main.postSavePoint(progress);
	},


	submit: function (assessment) {
		var data = ReadOnlyStore.getSubmissionPreparedForPost(assessment);
		var main = Utils.getMainSubmittable(assessment);

		return data.submit()
			.then(function (response) {
				if (Utils.isAssignment(assessment) && !isHistoryItem(response.Class)) {
					return main.loadPreviousSubmission();
				}
				return response;
			})
			.catch(function(reason){
				//force this to always fulfill.
				console.error('There was an error submitting the assessment: %o', reason.message || reason);
				return reason;
			});
	}

});
