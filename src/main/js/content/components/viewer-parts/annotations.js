import buffer from 'nti.lib.interfaces/utils/function-buffer';

import {preresolveLocatorInfo} from 'nti.lib.anchorjs';

import Highlight from '../annotations/Highlight';
import Note from '../annotations/Note';

const ANNOTATION_TYPES = [Highlight, Note];

export function select (item) {
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

	componentWillUnmount () {
		let store = getStore(this.state);
		if (store) {
			store.removeListener('change', this.onUserDataChange);
		}
	},

	componentWillUpdate (_, nextState) {
		let store = getStore(this.state);
		let nextStore = getStore(nextState);
		if (store && store !== nextStore) {
			store.removeListener('change', this.onUserDataChange);
		}
		else if (nextStore && nextStore !== store) {
			nextStore.addListener('change', this.onUserDataChange);
		}
	},


	componentDidUpdate () {
		let store = getStore(this.state);
		this.renderAnnotations(store);
	},


	onUserDataChange (store) {
		this.renderAnnotations(store);
	},


	preresolveLocators (store) {
		let descriptions = [], containers = [];
		for (let i of store) {
			descriptions.push(i.applicableRange);
			containers.push(i.ContainerId);
		}

		preresolveLocatorInfo(
			descriptions,
			this.getContentNode(),
			this.getContentNodeClean(),
			containers,
			this.getPageID());
	},


	renderAnnotations: buffer(50, function (store) {
		if (!store || !this.getContentNode()) { return; }
		console.debug('Render Pass');

		let newObjects = 0, skipped = 0, dead = 0, rendered = 0;
		let {annotations = {}} = this.state;

		let deadIDs = new Set(Object.keys(annotations));

		this.preresolveLocators(store);

		for (let i of store) {
			let id = i.getID();
			let annotation = annotations[id];

			deadIDs.delete(id);

			let Annotation = select(i);

			if ((annotation && !annotation.shouldRender()) || !Annotation) {
				skipped++;
				continue;
			}
			else if (!annotation) {
				newObjects++;
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

		if (rendered > 0 || dead > 0 || newObjects > 0) {
			this.setState({annotations});
		}
	})
};
