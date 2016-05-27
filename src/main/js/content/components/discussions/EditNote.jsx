import React from 'react';

import {encodeForURI} from 'nti-lib-ntiids';

import ContextSender from 'common/mixins/ContextSender';
import {Mixins} from 'nti-web-commons';

import Editor from './NoteEditor';

export default React.createClass({
	displayName: 'TopLevelNoteEditView',
	mixins: [
		ContextSender,
	Mixins.NavigatableMixin
	],

	propTypes: {
		item: React.PropTypes.object,
		contentPackage: React.PropTypes.object
	},


	getContext () {
		return {
			title: 'Edit'
		};
	},


	returnToView () {
		const {props: {item}} = this;
		const href = encodeForURI(item.getID());

		this.navigate(href, {replace: true});
	},


	onCancel () {
		this.returnToView();
	},


	onSave (item, data) {
		return item.save(data)
			.then(()=> this.returnToView());
	},


	render () {
		const {props: {item, contentPackage}} = this;
		return (
			<Editor item={item}
				scope={contentPackage}
				onCancel={this.onCancel}
				onSave={this.onSave}
				/>
		);
	}
});
