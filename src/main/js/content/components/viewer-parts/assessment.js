'use strict';

module.exports = {

	renderAssessmentSubmission: function () {
		var page = this.state.pageData;
		if (!page || !page.hasSubmittableAssessment()) {
			return null;
		}

		return '';
	}

};
