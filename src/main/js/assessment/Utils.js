import isEmpty from 'dataserverinterface/utils/isempty';


export function getMainSubmittable (assessment) {
	var p;

	do {
		p = assessment && assessment.parent('getSubmission');
		if (p) { assessment = p; }

	} while (p);

	return assessment;
}


export function isAssignment (assessment) {
	var main = getMainSubmittable(assessment) || false;
	return main && /assignment/i.test(main.MimeType || main.Class);
}


export function updatePartsWithAssessedParts (part, assessed) {
	var main = getMainSubmittable(part);
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


/**
 * Checks if the user agent matches the native android browser
 * http://stackoverflow.com/questions/14701951/javascript-detect-android-native-browser
 * @return {Bool} true if it doesn't match
 */
export function areAssessmentsSupported() {
	var nua = navigator.userAgent;
	var isAndroidNative =	/Mozilla\/5\.0/.test(nua) &&
							/Android /.test(nua) &&
							/AppleWebKit/.test(nua) &&
							!/Chrome/.test(nua);

	var isAndroidFireFox =	/Mozilla\/5\.0/.test(nua) &&
							/Android/.test(nua) &&
							/Firefox/i.test(nua);

	return !(isAndroidNative || isAndroidFireFox);
}
