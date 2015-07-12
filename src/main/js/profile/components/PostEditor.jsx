import React from 'react';
import t from 'common/locale';
import cx from 'classnames';
import Editor from 'modeled-content/components/Editor';

export default React.createClass({
	displayName: 'PostEditor',

	propTypes: {
		onSubmit: React.PropTypes.func.isRequired,
		onCancel: React.PropTypes.func.isRequired,
		title: React.PropTypes.string,
		value: React.PropTypes.any
	},

	getInitialState: function() {
		return {
		};
	},

	componentWillMount: function() {
		this.setState({
			title: this.props.title,
			value: this.props.value
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

	doSubmit () {
		let {onSubmit} = this.props;
		let {title, value} = this.state;
		title = this.refs.title.getDOMNode().value;
		value = this.refs.editor.getValue();
		if (typeof onSubmit === 'function') {
			onSubmit(title, value);
		}
	},

	render () {
		let {busy, value, title, error} = this.state;
		let disabled = Editor.isEmpty(value) || Editor.isEmpty(title);
		return (
			<div className="editor">
				<input type="text" ref="title" onChange={this.onTitleChange} defaultValue={this.props.title} />
				<Editor ref="editor" onChange={this.onChange} onBlur={this.onChange} value={this.props.value}>
					<button onClick={this.props.onCancel} className={'cancel'}>{t('BUTTONS.cancel')}</button>
					<button onClick={this.doSubmit} className={cx('save', {disabled})}>{t('BUTTONS.save')}</button>
				</Editor>
			</div>
		);
	}
});
