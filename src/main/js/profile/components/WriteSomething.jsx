import React from 'react';
import Editor from 'modeled-content/components/Editor';
import t from 'common/locale';
import cx from 'classnames';
import Loading from 'common/components/TinyLoader';
import Err from 'common/components/Error';

export default React.createClass({
	displayName: 'WriteSomething',

	propTypes: {
		store: React.PropTypes.shape({
			postToActivity: React.PropTypes.func
		}).isRequired
	},

	getInitialState: function() {
		return {
			edit: false,
			value: null
		};
	},

	showEditor() {
		this.setState({
			edit: true
		});
	},

	hideEditor() {
		this.setState({
			edit: false
		});
	},

	onTitleChange (event) {
		this.setState({
			title: event.target.value
		});
	},

	onChange () {
		let value = this.refs.editor.getValue();
		this.setState({value});
	},

	onCancel () {
		this.hideEditor();
	},

	onSubmit () {
		let {title, value} = this.state;
		if (Editor.isEmpty(value) || Editor.isEmpty(title)) {
			return;
		}
		let {store} = this.props;
		this.setState({
			busy: true
		});
		store.postToActivity(value, title)
		.then(result => {
			console.log(result);
			this.setState({
				edit: false,
				busy: false,
				error: false,
				value: null
			});
		},
		reason => {
			this.setState({
				busy: false,
				error: reason
			});
		});
	},

	render () {

		let {busy, value, title, error} = this.state;

		if (error) {
			return <Err error={error} />;
		}

		if (busy) {
			return <Loading />;
		}

		let disabled = Editor.isEmpty(value) || Editor.isEmpty(title);

		return (
			<div className="write-something">
				{this.state.edit
					?
					<div className="editor">
						<input type="text" ref="title" onChange={this.onTitleChange} />
						<Editor ref="editor" onChange={this.onChange} onBlur={this.onChange}>
							<button onClick={this.onCancel} className={'cancel'}>{t('BUTTONS.cancel')}</button>
							<button onClick={this.onSubmit} className={cx('save', {disabled})}>{t('BUTTONS.save')}</button>
						</Editor>
					</div>
					:
					<label onClick={this.showEditor}>Write something</label>
				}
			</div>
		);
	}

});
