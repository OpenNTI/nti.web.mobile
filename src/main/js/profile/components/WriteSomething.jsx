import React from 'react';
import Editor from 'modeled-content/components/Editor';
import t from 'common/locale';
import cx from 'classnames';

export default React.createClass({
	displayName: 'WriteSomething',

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

	onChange () {
		let value = this.refs.editor.getValue();
		this.setState({value});
	},

	onCancel () {
		this.hideEditor();
	},

	render () {

		let {busy, value} = this.state;
		let disabled = Editor.isEmpty(value);

		return (
			<div className="write-something">
				{this.state.edit
					?
					<Editor ref="editor" onChange={this.onChange} onBlur={this.onChange}>
						<button onClick={this.onCancel} className={'cancel'}>{t('BUTTONS.cancel')}</button>
						<button onClick={this.onSubmit} className={cx('save', {disabled})}>{t('BUTTONS.save')}</button>
					</Editor>
					:
					<label onClick={this.showEditor}>Write something</label>
				}
			</div>
		);
	}

});
