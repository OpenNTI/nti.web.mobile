import React from 'react';

import ContextSender from 'common/mixins/ContextSender';

import Editor from './NoteEditor';

export default React.createClass({
	displayName: 'TopLevelNoteEditor',
	mixins: [
		ContextSender
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
		history.go(-1); //TODO: replace location instead of just going back.
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
