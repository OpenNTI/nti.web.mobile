import React from 'react';

import cx from 'classnames';

import {Editor} from 'modeled-content';

import t from 'common/locale';

import Loading from 'common/components/Loading';

export default React.createClass({
	displayName: 'ReplyEditor',

	propTypes: {
		value: React.PropTypes.array,

		onCancel: React.PropTypes.func,


		onSubmit: React.PropTypes.func
	},


	getInitialState () {
		return {};
	},


	componentWillMount () {
		this.setState({
			value: this.props.value || null
		});
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

	onSubmit (e) {
		e.preventDefault();
		e.stopPropagation();


		let {value} = this.state;

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
			.catch(()=> {
				//is there a message to display?
			})
			.then(()=> this.isMounted() && this.setState({busy: false}));
	},


	render () {
		let {value, busy} = this.state;

		let disabled = Editor.isEmpty(value);

		return (
			<div className={cx('reply editor', {busy})}>
				<Editor ref="editor" value={value} onChange={this.onChange} onBlur={this.onChange}>
					<button onClick={this.onCancel} className={'cancel'}>{t('BUTTONS.cancel')}</button>
					<button onClick={this.onSubmit} className={cx('save', {disabled})}>{t('BUTTONS.save')}</button>
				</Editor>

				{busy ? ( <Loading message="Saving..."/> ) : null}
			</div>
		);
	}
});
