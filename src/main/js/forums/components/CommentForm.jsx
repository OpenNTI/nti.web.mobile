import React from 'react';
import {Editor} from 'modeled-content';

import Notice from 'common/components/Notice';
import OkCancelButtons from 'common/components/OkCancelButtons';
import PanelButton from 'common/components/PanelButton';
import Loading from 'common/components/TinyLoader';

import StoreEvents from 'common/mixins/StoreEvents';

import * as Actions from '../Actions';
import Store from '../Store';
import {COMMENT_ADDED, COMMENT_SAVED, COMMENT_ERROR} from '../Constants';

import {scoped} from 'common/locale';

let t = scoped('FORUMS');

export default React.createClass({
	displayName: 'CommentForm',

	mixins: [StoreEvents],

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

	getInitialState () {
		return {
			busy: false,
			complete: false,
			canSubmit: false,
			error: null
		};
	},


	getValue () {
		return this.refs.editor.getValue();
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

	onBodyChange (oldValue, newValue) {
		this.setState({
			canSubmit: (newValue && newValue.length > 0)
		});
	},

	render () {

		if (this.state.busy) {
			return <Loading />;
		}

		if (false && this.state.complete) {
			return <Notice>Comment added</Notice>;
		}

		let savefunc = this.props.editItem ? this.onSave.bind(this, this.props.editItem) : this.onAddComment;


		let value = (this.props.editItem || {}).body;

		return (
			<div className="comment-form" id={this.props.id}>
				{this.state.error && <Notice className="err">{this.state.error.message || 'An error occurred.'}</Notice>}
				<div className="comment-form-heading">{t('addComment')}</div>
				<Editor ref="editor"
					onChange={this.onBodyChange}
					value={value}
					allowInsertVideo
					>
					<OkCancelButtons
						onOk={savefunc}
						okEnabled={this.state.canSubmit}
						onCancel={this.props.onCancel}
						okText={t('editorOkButton')} />
				</Editor>
			</div>
		);
	}

});
