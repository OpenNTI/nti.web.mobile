import GlossaryEntry from '../GlossaryEntry';
import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

export default {

	getInitialState () {
		this.registerContentViewerSubRoute('/glossary/:glossaryId');
	},


	getGlossaryId () {
		return this.getPropsFromRoute({}).glossaryId;
	},


	onDismissGlossary (evt) {
		evt.preventDefault();
		let pid = encodeForURI(this.getPageID());
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
