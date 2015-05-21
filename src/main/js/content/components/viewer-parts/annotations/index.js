import buffer from 'nti.lib.interfaces/utils/function-buffer';

import Highlight from './Highlight';
import Note from './Note';

const ANNOTATION_TYPES = [Highlight, Note];

function select (item) {
	for (let type of ANNOTATION_TYPES) {
		if (!type.handles) {
			console.warn('Annotation missing handles static method: ', type);
		}
		else if (type.handles(item)) {
			return type;
		}
	}

	console.warn('Unhandled Item:', item);
}


function getStore (state) {
	let {page} = state;
	return page && page.getUserDataStore();
}


export default {

	getContentNode () {
		let {content} = this.refs;
		return content && content.getCurrent();
	},

	getContentNodeClean () {
		let {content} = this.refs;
		return content && content.getPristine();
	},


	componentWillUpdate (_, nextState) {
		let store = getStore(this.state);
		let nextStore = getStore(nextState);
		if (store && store !== nextStore) {
			store.removeListener('load', this.onUserDataChange);
		}
		else if (nextStore && nextStore !== store) {
			nextStore.addListener('load', this.onUserDataChange);
		}
	},

	componentDidUpdate () {
		let store = getStore(this.state);
		this.renderAnnotations(store);
	},


	onUserDataChange (store) {
		this.renderAnnotations(store);
	},


	renderAnnotations: buffer(50, function (store) {
		if (!store) { return; }
		console.debug('Render Pass');
		for (let i of store) {
			let Annotation = select(i);
			let annotation = new Annotation(i, this);
			console.log(annotation.render());
		}
	})
};
