import GlossaryEntry from '../GlossaryEntry';

export default {

	getInitialState () {
		this.registerContentViewerSubRoute('/:pageId/glossary/:glossaryId');
	},


	getGlossaryId () {
		return this.getPropsFromRoute({}).glossaryId;
	},


	onDismissGlossary (evt) {
		evt.preventDefault();
		let pid = this.getPropsFromRoute({}).pageId;
		this.navigate(`/${pid}/`);
	},


	renderGlossaryEntry () {
		let id = this.getGlossaryId();
		if (id) {
			return GlossaryEntry({
					entryid: id,
					onClick: this.onDismissGlossary
				});
		}
	}
};
