import React from 'react';

import {encodeForURI} from 'nti-lib-ntiids';

import ContextSender from 'common/mixins/ContextSender';
import {Mixins} from 'nti-web-commons';

import ReplyEditor from './ReplyEditor';

export default React.createClass({
	displayName: 'NoteCommentEditView',
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


	onSubmitted () {
		this.returnToView();
	},


	render () {
		const {props: {item}} = this;
		return (
			<ReplyEditor item={item} value={item.body} onCancel={this.onCancel} onSubmitted={this.onSubmitted}/>
		);
	}
});
