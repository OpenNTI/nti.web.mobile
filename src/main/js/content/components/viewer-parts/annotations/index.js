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


function getStore (o) {
	let {page} = o;
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
		if (!store || !this.getContentNode()) { return; }
		console.debug('Render Pass');

		let newObjects = 0, skipped = 0, dead = 0, rendered = 0;
		let {annotations = {}} = this.state;

		let deadIDs = new Set(Object.keys(annotations));

		for (let i of store) {
			let id = i.getID();
			let annotation = annotations[id];

			deadIDs.delete(id);

			if (annotation && !annotation.shouldRender()) {
				skipped++;
				continue;
			}
			else if (!annotation) {
				newObjects++;
				let Annotation = select(i);
				annotation = new Annotation(i, this);
				annotations[id] = annotation;
			}

			if (annotation.render()) {
				rendered++;
			}
		}

		for (let i of deadIDs) {
			dead++;
			//annotations[i].cleanup();
			delete annotations[i];
		}

		console.debug('Render Complete: rendered: %s, new: %s, skipped: %s, removed: %s', rendered, newObjects, skipped, dead);

		if (rendered > 0 || dead > 0) {
			this.setState({annotations});
		}
	})
};
