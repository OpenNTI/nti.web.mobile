'use strict';

var define = require('dataserverinterface/utils/object-define-hidden-props');
var merge = require('merge');

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

	merge(this, data);
}


merge(PageDescriptor.prototype, {
	getID: function() {return this.ntiid;},

	getPageSource: function(id){ return this.tableOfContents.getPageSource(id);},

	getTableOfContents: function () { return this.tableOfContents; },

	getBodyParts: function () { return this._content.parsed; },

	getPageStyles: function () { return this.styles; }
});


module.exports = PageDescriptor;
