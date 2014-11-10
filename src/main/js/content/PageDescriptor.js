'use strict';

var define = require('dataserverinterface/utils/object-define-hidden-props');
var assign = Object.assign || require('object-assign');

var Utils = require('common/Utils');

function PageDescriptor(ntiid, data) {
	this.ntiid = ntiid;
	define(this, {
		_created: new Date(),
		_service: data.pageInfo._service,

		_content: {
			raw: data.content,
			parsed: data.body
		}
	});

	delete data.content;
	delete data.body;

	assign(this, data);
}


assign(PageDescriptor.prototype, {
	getID: function() {return this.ntiid;},


	getPageSource: function(id){ return this.tableOfContents.getPageSource(id);},


	getTableOfContents: function () { return this.tableOfContents; },


	getBodyParts: function () { return this._content.parsed; },


	getPageStyles: function () { return this.styles; },


	getAssessmentQuestion: function (questionId) {
		if (!Utils.isFlag('dev')) {
			return null;
		}
		return this.pageInfo.getAssessmentQuestion(questionId);
	},


	hasSubmittableAssessment: function() {
		var items = this.pageInfo.AssessmentItems || [];
		return items.reduce(function(v, item) {
			return v || (item.isSubmittable); }, null);
	}
});


module.exports = PageDescriptor;
