'use strict';

import React from 'react';
import {Editor} from 'modeled-content';
import PanelButton from 'common/components/PanelButton';
import Notice from 'common/components/Notice';
import OkCancelButtons from 'common/components/OkCancelButtons';
import Loading from 'common/components/LoadingInline';
import Actions from '../Actions';
import Store from '../Store';
import {COMMENT_ADDED, COMMENT_SAVED, COMMENT_ERROR} from '../Constants';
import StoreEvents from 'common/mixins/StoreEvents';
import {scoped} from 'common/locale';

let t = scoped('FORUMS');

var CommentForm = React.createClass({

	mixins: [StoreEvents],

	backingStore: Store,
	backingStoreEventHandlers: {
		[COMMENT_ADDED]: '_success',
		[COMMENT_SAVED]: '_success',
		[COMMENT_ERROR]: function(event) {
			this.setState({
				error: event.data.reason,
				busy: false
			});
		}
	},

	getInitialState: function() {
		return {
			busy: false,
			complete: false,
			canSubmit: false,
			error: null
		};
	},

	getValue() {
		return this.refs.editor.getValue();
	},

	componentDidMount: function() {
		this.getDOMNode().scrollIntoView(false);
	},

	_success: function() {
		this.setState({
			busy: false,
			complete: true,
			error: null
		});
		if (this.props.onCompletion) {
			this.props.onCompletion(event);
		}
	},

	_addComment: function() {
		var val = this.getValue();
		if (!val || val.length === 0) {
			return;
		}
		this.setState({
			busy: true
		});
		Actions.addComment(this.props.topic, this.props.parent, val);
	},

	_save: function(item) {
		this.setState({
			busy: true
		});
		Actions.saveComment(item, {
			body: this.getValue()
		});
	},

	_bodyChange(oldValue, newValue) {
		this.setState({
			canSubmit: (newValue && newValue.length > 0)
		});
	},
 
	render: function() {

		if (this.state.busy) {
			return <Loading />;
		}

		if (false && this.state.complete) {
			return <Notice>Comment added</Notice>;
		}

		var savefunc = this.props.editItem ? this._save.bind(this, this.props.editItem) : this._addComment;
		var buttons = <OkCancelButtons onOk={savefunc} okEnabled={this.state.canSubmit} onCancel={this.props.onCancel} okText={t('editorOkButton')} />;
		var value = (this.props.editItem||{}).body;

		return (
			<PanelButton className="comment-form" linkText='Submit' button={buttons}>
				{this.state.error && <Notice className="err">{this.state.error.message||'An error occurred.'}</Notice>}
				<Editor ref='editor'
					onChange={this._bodyChange}
					value={value} />
			</PanelButton>
		);
	}

});

module.exports = CommentForm;
