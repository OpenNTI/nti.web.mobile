'use strict';

var GlossaryEntry = require('../GlossaryEntry');

module.exports = {

	getInitialState: function() {
		this.__registerRoute('/:pageId/glossary/:glossaryId');
	},


	getGlossaryId: function () {
		return this.getPropsFromRoute({}).glossaryId;
	},

	onDismissGlossary: function(evt) {
		evt.preventDefault();
		var pid = this.getPropsFromRoute({}).pageId;
		this.navigate('/'+pid+'/');
	},


	renderGlossaryEntry: function () {
		var id = this.getGlossaryId();
		if (id) {
			return GlossaryEntry({
					entryid: id,
					onClick: this.onDismissGlossary
				});
		}
	}
};
