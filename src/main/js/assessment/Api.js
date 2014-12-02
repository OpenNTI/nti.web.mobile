'use strict';

var ReadOnlyStore = require('./Store');
var Utils = require('./Utils');

Object.assign(exports, {

	loadSavePoint: function(assessment) {
		var main = Utils.getMainSubmittable(assessment);
		if (!main) {return Promise.reject();}

		return main.loadSavePoint();
	},


	saveProgress: function (assessment) {
		var main = Utils.getMainSubmittable(assessment);
		var progress = ReadOnlyStore.getSubmissionData(assessment);

		if (!main) {return Promise.reject();}

		return main.postSavePoint(progress);
	},


	submit: function (assessment) {
		var data = ReadOnlyStore.getSubmissionData(assessment);

		return data.submit();
	}

});
