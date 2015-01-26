'use strict';

var isEmpty = require('dataserverinterface/utils/isempty');

Object.assign(exports, {

	getMainSubmittable: function (assessment) {
		var p;

		do {
			p = assessment && assessment.parent('getSubmission');
			if (p) { assessment = p; }

		} while (p);

		return assessment;
	},


	isAssignment: function (assessment) {
		var main = this.getMainSubmittable(assessment) || false;
		return main && /assignment/i.test(main.MimeType || main.Class);
	},


	updatePartsWithAssessedParts: function (part, assessed) {
		var main = this.getMainSubmittable(part);
		var questions = assessed.getQuestions ? assessed.getQuestions() : [assessed];

		questions.forEach(q => {
			var x = q.parts.length - 1;
			var question = main.getQuestion ?
							main.getQuestion(q.getID()) :
							(main.getID() === q.getID() ? main : null);

			if (!question || q.parts.length !== question.parts.length) {
				console.error('We have an assessed value, but no where to put it. (Question is missing or has the wrong number of parts)');
				return;
			}

			for (x; x >= 0; x--) {
				if (!isEmpty(q.parts[x])) {
					question.parts[x].updateFromAssessed(q.parts[x]);
				}
			}
		});

	}

});
