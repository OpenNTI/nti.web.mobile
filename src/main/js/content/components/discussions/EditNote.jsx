import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import {encodeForURI} from '@nti/lib-ntiids';
import {Mixins} from '@nti/web-commons';

import ContextSender from 'common/mixins/ContextSender';

import Editor from './NoteEditor';

export default createReactClass({
	displayName: 'TopLevelNoteEditView',
	mixins: [
		ContextSender,
		Mixins.NavigatableMixin
	],

	propTypes: {
		item: PropTypes.object,
		contentPackage: PropTypes.object
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
