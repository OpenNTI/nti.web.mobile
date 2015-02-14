import GlossaryEntry from '../GlossaryEntry';

export default {

	getInitialState () {
		this.__registerRoute('/:pageId/glossary/:glossaryId');
	},


	getGlossaryId () {
		return this.getPropsFromRoute({}).glossaryId;
	},


	onDismissGlossary (evt) {
		evt.preventDefault();
		var pid = this.getPropsFromRoute({}).pageId;
		this.navigate('/'+pid+'/');
	},


	renderGlossaryEntry () {
		var id = this.getGlossaryId();
		if (id) {
			return GlossaryEntry({
					entryid: id,
					onClick: this.onDismissGlossary
				});
		}
	}
};
