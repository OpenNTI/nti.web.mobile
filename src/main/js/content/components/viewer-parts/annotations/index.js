import React from 'react';
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
}


function getStore (state) {
	let {page} = state;
	return page && page.getUserDataStore();
}


export default {

	getContentNode () {
		return React.findDOMNode(this.refs.content);
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

	componentDidUpdate (/*prevProps, prevState*/) {
		// let pageId = this.getPageID();
		let {page} = this.state;

		console.log('Whats my page?! %o', page);
	},


	onUserDataChange (store) {
		console.log('Hi!');
	}

};
