'use strict';

var isEmpty = require('dataserverinterface/utils/isempty');

Object.assign(exports, {

	getMainSubmittable: function (assessment) {
		var p;

		do {
			p = assessment && assessment.up('getSubmission');
			if (p) { assessment = p; }

		} while (p);

		return assessment;
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
				throw new Error('Shoot. I just don`t know what this world is coming to. Ending it all. Abort!');
			}

			for (x; x >= 0; x--) {
				if (!isEmpty(q.parts[x])) {
					question.parts[x].updateFromAssessed(q.parts[x]);
				}
			}
		});

	}

});
