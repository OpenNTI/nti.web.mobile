import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import { Notice, OkCancelButtons, Loading } from '@nti/web-commons';
import { StoreEventsMixin } from '@nti/lib-store';
import { scoped } from '@nti/lib-locale';
import { Editor } from 'internal/modeled-content';

import * as Actions from '../Actions';
import Store from '../Store';
import { COMMENT_ADDED, COMMENT_SAVED, COMMENT_ERROR } from '../Constants';

const DEFAULT_TEXT = {
	placeholder: 'Add a Comment',
	save: 'Save',
};

const t = scoped('forums.comment', DEFAULT_TEXT);

export default createReactClass({
	displayName: 'CommentForm',

	mixins: [StoreEventsMixin],

	propTypes: {
		id: PropTypes.string,

		onCancel: PropTypes.func,
		onCompletion: PropTypes.func,

		editItem: PropTypes.object, //??
		topic: PropTypes.object.isRequired,
		parent: PropTypes.object,
	},

	backingStore: Store,
	backingStoreEventHandlers: {
		[COMMENT_ADDED]: 'onSuccess',
		[COMMENT_SAVED]: 'onSuccess',
		[COMMENT_ERROR](event) {
			this.setState({
				error: event.data.reason,
				busy: false,
			});
		},
	},

	attachEditorRef(x) {
		this.editor = x;
	},

	getInitialState() {
		return {
			busy: false,
			complete: false,
			canSubmit: false,
			error: null,
		};
	},

	getValue() {
		return this.editor.getValue();
	},

	onSuccess() {
		this.setState({
			busy: false,
			complete: true,
			error: null,
		});

		if (this.props.onCompletion) {
			this.props.onCompletion();
		}
	},

	onAddComment() {
		let val = this.getValue();
		if (!val || val.length === 0) {
			return;
		}
		this.setState({
			busy: true,
		});
		Actions.addComment(this.props.topic, this.props.parent, val);
	},

	onSave(item) {
		this.setState({
			busy: true,
		});
		Actions.saveComment(item, {
			body: this.getValue(),
		});
	},

	onBodyChange() {
		this.setState({
			canSubmit: !Editor.isEmpty(this.editor.getValue()),
		});
	},

	render() {
		const {
			props: { editItem, id, onCancel, topic },
			state: { busy, canSubmit, error },
		} = this;

		if (busy) {
			return <Loading.Ellipse />;
		}

		const savefunc = editItem
			? (...args) => this.onSave(this.props.editItem, ...args)
			: this.onAddComment;

		const value = (editItem || {}).body;

		return topic && topic.hasLink('add') ? (
			<div className="comment-form" id={id}>
				{error && (
					<Notice className="err">
						{error.message || 'An error occurred.'}
					</Notice>
				)}
				<div className="comment-form-heading">{t('placeholder')}</div>
				<Editor
					ref={this.attachEditorRef}
					onChange={this.onBodyChange}
					initialValue={value}
					allowInsertVideo
				>
					<OkCancelButtons
						onOk={savefunc}
						okEnabled={canSubmit}
						onCancel={onCancel}
						okText={t('save')}
					/>
				</Editor>
			</div>
		) : null;
	},
});
