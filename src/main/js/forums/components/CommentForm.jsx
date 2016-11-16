import React from 'react';
import {Editor} from 'modeled-content';

import {Notice, OkCancelButtons, Loading} from 'nti-web-commons';

import {StoreEventsMixin} from 'nti-lib-store';

import * as Actions from '../Actions';
import Store from '../Store';
import {COMMENT_ADDED, COMMENT_SAVED, COMMENT_ERROR} from '../Constants';

import {scoped} from 'nti-lib-locale';

let t = scoped('FORUMS');

export default React.createClass({
	displayName: 'CommentForm',

	mixins: [StoreEventsMixin],

	propTypes: {
		id: React.PropTypes.string,

		onCancel: React.PropTypes.func,
		onCompletion: React.PropTypes.func,

		editItem: React.PropTypes.object,//??
		topic: React.PropTypes.object,
		parent: React.PropTypes.object
	},

	backingStore: Store,
	backingStoreEventHandlers: {
		[COMMENT_ADDED]: 'onSuccess',
		[COMMENT_SAVED]: 'onSuccess',
		[COMMENT_ERROR] (event) {
			this.setState({
				error: event.data.reason,
				busy: false
			});
		}
	},

	attachEditorRef (x) { this.editor = x; },

	getInitialState () {
		return {
			busy: false,
			complete: false,
			canSubmit: false,
			error: null
		};
	},


	getValue () {
		return this.editor.getValue();
	},


	onSuccess () {
		this.setState({
			busy: false,
			complete: true,
			error: null
		});

		if (this.props.onCompletion) {
			this.props.onCompletion(event);
		}
	},


	onAddComment () {
		let val = this.getValue();
		if (!val || val.length === 0) {
			return;
		}
		this.setState({
			busy: true
		});
		Actions.addComment(this.props.topic, this.props.parent, val);
	},


	onSave (item) {
		this.setState({
			busy: true
		});
		Actions.saveComment(item, {
			body: this.getValue()
		});
	},


	onBodyChange () {
		this.setState({
			canSubmit: !Editor.isEmpty(this.editor.getValue())
		});
	},

	render () {
		const {
			props: {
				editItem,
				id,
				onCancel,
				topic
			},
			state: {
				busy,
				canSubmit,
				error
			}
		} = this;

		if (busy) {
			return <Loading.Ellipse />;
		}

		const savefunc = editItem
						? (...args) => this.onSave(this.props.editItem, ...args)
						: this.onAddComment;


		const value = (editItem || {}).body;

		return topic.hasLink('add') && (
			<div className="comment-form" id={id}>
				{error && <Notice className="err">{error.message || 'An error occurred.'}</Notice>}
				<div className="comment-form-heading">{t('entryPlaceholder')}</div>
				<Editor ref={this.attachEditorRef}
					onChange={this.onBodyChange}
					initialValue={value}
					allowInsertVideo
					>
					<OkCancelButtons
						onOk={savefunc}
						okEnabled={canSubmit}
						onCancel={onCancel}
						okText={t('editorOkButton')} />
				</Editor>
			</div>
		);
	}

});
