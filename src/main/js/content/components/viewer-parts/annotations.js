import Logger from 'nti-util-logger';
import {buffer} from 'nti-commons';

import {createRangeDescriptionFromRange, preresolveLocatorInfo} from 'nti-lib-anchorjs';
import {getEventTarget, parent} from 'nti-lib-dom';

import Highlight from '../annotations/Highlight';
import Note from '../annotations/Note';

const logger = Logger.get('content:components:viewer-parts:annotations');
const ANNOTATION_TYPES = [Highlight, Note];

export function select (item) {
	for (let type of ANNOTATION_TYPES) {
		if (!type.handles) {
			logger.warn('Annotation missing "handles" static method: ', type);
		}
		else if (type.handles(item)) {
			return type;
		}
	}

	logger.warn('Unhandled Item:', item);
}


const rotate = (a, ix) => a.slice(ix).concat(a.slice(0, ix));


function getStore (o) {
	let {page} = o;
	return page && page.getUserDataStore();
}


export default {

	getContentNode () {
		let {content} = this;
		return content && content.getCurrent();
	},

	getContentNodeClean () {
		let {content} = this;
		return content && content.getPristine();
	},

	componentWillUnmount () {
		let store = getStore(this.state);
		if (store) {
			store.removeListener('change', this.onUserDataChange);
		}
	},

	componentWillUpdate (_, nextState) {
		let {annotations} = this.state;
		let store = getStore(this.state);
		let nextStore = getStore(nextState);

		if (store && store !== nextStore) {
			store.removeListener('change', this.onUserDataChange);
			if (annotations) {
				for (let i of Object.keys(annotations)) {
					delete annotations[i];
				}
			}
		}

		if (nextStore && nextStore !== store) {
			nextStore.addListener('change', this.onUserDataChange);
		}
	},


	componentDidUpdate (_, prevState) {
		const store = getStore(this.state);
		this.renderAnnotations(store);

		const {stagedNote} = this.state;

		if (!stagedNote && prevState.scrollPosition && prevState.stagedNote) {
			this.scrollToPosition(prevState.scrollPosition);
		}
	},


	onUserDataChange (store) {
		this.renderAnnotations(store);
	},


	preresolveLocators (store) {
		let descriptions = [], containers = [];
		for (let i of store) {
			let {applicableRange} = i;
			if (applicableRange) {
				descriptions.push(applicableRange);
				containers.push(i.ContainerId);
			}
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
		logger.debug('Render Pass');

		const {annotations : previousAnnotations = {}} = this.state;
		const annotations = {};
		const deadIDs = new Set(Object.keys(previousAnnotations));

		let newObjects = 0, skipped = 0, dead = 0, rendered = 0;

		this.preresolveLocators(store);

		for (let i of store) {
			let {applicableRange} = i;
			let id = i.getID();
			let annotation = previousAnnotations[id];

			if (!applicableRange) { continue; }

			deadIDs.delete(id);
			annotations[id] = annotation;

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

		dead = deadIDs.size;

		logger.debug('Render Complete: rendered: %s, new: %s, skipped: %s, removed: %s', rendered, newObjects, skipped, dead);

		if (rendered > 0 || dead > 0 || newObjects > 0) {
			this.setState({annotations});
		}
	}),


	maybeOfferAnnotations (eventMeta, selected) {
		if (!selected) {
			let e = getEventTarget(eventMeta);
			let highlights = [];

			let p;
			while ((p = parent(e, '.application-highlight'))) {
				let item = this.getAnnotationFromNode(p);
				//ignore annotations you cannot control.
				if (item.isModifiable) {
					highlights.push(item);
				}
				e = p.parentNode;
			}

			if (highlights.length > 1) {
				let index = highlights.indexOf(this.state.selected);
				if (index !== -1) {
					highlights = rotate(highlights, index + 1);
				}
			}

			selected = highlights[0];
		}

		if (this.state.selected !== selected) {
			this.setState({selected});
		}
	},


	getAnnotationFromNode (node) {
		const {annotations = {}} = this.state;
		for (let a of Object.values(annotations)) {
			if (a && a.ownsNode(node)) {
				return a;
			}
		}
	},


	/**
	 * All Notes and highlights have these fields in common.
	 *
	 * @param {Range} range DOM Range.
	 *
	 * @return {Object} The common applicable fields.
	 */
	selectionToCommonUGD (range) {
		if (!range || range.collapsed) {
			throw new Error('Cannot create an annotation from null or collapsed ranges');
		}

		//generate the range description
		const data = createRangeDescriptionFromRange(range, this.getContentNode());
		console.log(data);
		const {description: applicableRange, container: ContainerId} = data;

		return {
			ContainerId,
			applicableRange,
			selectedText: range.toString()
		};
	},


	saveNote (item, data) {
		const itemData = item && item.getData ? item.getData() : item;
		const result = getStore(this.state).create({...itemData, ...data});


		//Do not clear the stagedNode from state until
		//after the UI has had an opportunity to draw a frame. (allow us to queue an animation)
		result.then(()=> setTimeout(() => this.setState({scrollPosition: void 0, stagedNote: void 0}), 1), () => {});

		return result;
	},


	createNote (range) {
		const {contentPackage} = this.props;
		const {selected, page} = this.state;
		const hasRange = range && !range.collapsed;

		let properties = hasRange && this.selectionToCommonUGD(range);
		if (!properties && selected) {
			let {applicableRange, selectedText, ContainerId} = selected.getRecord();
			properties = {
				applicableRange,
				selectedText,
				ContainerId
			};
		}

		this.setState({selected: void 0, scrollPosition: this.getScrollPosition()});

		window.scrollTo(0,0);

		page.getSharingPreferences()
			.then(preferences => contentPackage.getDefaultShareWithValue(preferences))
			.then(sharedWith =>
				Note.createFrom({...properties, sharedWith})
			)
			.then(note => this.setState({stagedNote: note}));
	},


	createHighlight (range, color) {
		new Promise((resolve, reject) => {
			let highlight = Highlight.createFrom(this.selectionToCommonUGD(range), color);

			getStore(this.state).create(highlight).then(resolve, reject);
		})
			.catch(e => logger.warn(e.stack || e.message || e))
			.then(() => this.setState({selected: void 0}));
	},


	updateHighlight (_, color) {
		let {selected} = this.state;
		try {
			selected.updateColor(color)
				.then(()=> this.forceUpdate());
		} catch (e) {
			logger.warn(e.stack || e.message || e);
		}
	},


	removeHighlight () {
		let {selected} = this.state;
		try {
			selected.remove()
				.then(this.setState({selected: void 0}));
		}
		catch (e) {
			logger.warn(e.stack || e.message || e);
		}
	}
};
