import React from 'react';

import cx from 'classnames';

import {Editor} from 'modeled-content';

import Loading from 'common/components/Loading';

import t from 'common/locale';

export default React.createClass({
	displayName: 'FeedbackEditor',

	propTypes: {
		onCancel: React.PropTypes.func,
		onSubmit: React.PropTypes.func.isRequired,
		value: React.PropTypes.array
	},


	componentWillMount () {
		this.setState({
			value: this.props.value || null
		});
	},


	render () {
		let {value, busy} = this.state;
		let disabled = Editor.isEmpty(value);

		return (
			<div className={cx('feedback editor', {busy})}>

				<Editor ref="editor" value={value} onChange={this.onChange} onBlur={this.onChange} allowInsertImage={false}>
					<button onClick={this.onCancel} className={'cancel'}>{t('BUTTONS.cancel')}</button>
					<button onClick={this.onClick} className={cx('save', {disabled})}>{t('BUTTONS.save')}</button>
				</Editor>

				{busy ?
					<Loading message="Saving..."/> : null}
			</div>
		);
	},


	onChange () {
		let value = this.refs.editor.getValue();
		this.setState({value});
	},


	onCancel (e) {
		e.preventDefault();
		e.stopPropagation();
		this.props.onCancel();
	},


	onClick (e) {
		e.preventDefault();
		e.stopPropagation();

		let value = this.refs.editor.getValue();

		if (Editor.isEmpty(value)) {
			return;
		}

		this.setState({busy: true});
		let thenable = this.props.onSubmit(value);
		if (!thenable) {
			console.error('onSubmit callback did not return a thenable, this component will never leave the busy state.');
			return;
		}

		thenable
			.catch(()=> {})
			.then(()=> {
				if (this.isMounted()) {
					this.setState({busy: false});
				}
			});
	}
});
