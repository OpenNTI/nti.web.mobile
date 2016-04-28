import React from 'react';
import cx from 'classnames';

import Logger from 'nti-util-logger';

import {Editor} from 'modeled-content';

import Loading from 'common/components/Loading';

import t from 'common/locale';

const logger = Logger.get('assessment:components:FeedbackEditor');

export default React.createClass({
	displayName: 'FeedbackEditor',

	propTypes: {
		onCancel: React.PropTypes.func,
		onSubmit: React.PropTypes.func.isRequired,
		value: React.PropTypes.array
	},


	componentWillMount () {
		this.updateDisabled(this.props.value || null);
	},


	componentWillReceiveProps (nextProps) {
		if (nextProps.value !== this.props.value) {
			this.updateDisabled(nextProps.value);
		}
	},


	updateDisabled (value) {
		let disabled = Editor.isEmpty(value);
		this.setState({disabled});
	},


	render () {
		let {disabled, busy} = this.state;

		return (
			<div className={cx('feedback editor', {busy})}>

				<Editor ref={x => this.editor = x}
					initialValue={this.props.value}
					onChange={this.onChange}
					onBlur={this.onChange}
					allowInsertImage={false}
					>
					<button onClick={this.onCancel} className={'cancel'}>{t('BUTTONS.cancel')}</button>
					<button onClick={this.onClick} className={cx('save', {disabled})}>{t('BUTTONS.save')}</button>
				</Editor>

				{busy ?
					<Loading message="Saving..."/> : null}
			</div>
		);
	},


	onChange () {
		let value = this.editor.getValue();
		this.updateDisabled(value);
	},


	onCancel (e) {
		e.preventDefault();
		e.stopPropagation();
		this.props.onCancel();
	},


	onClick (e) {
		e.preventDefault();
		e.stopPropagation();

		let value = this.editor.getValue();

		if (Editor.isEmpty(value)) {
			return;
		}

		this.setState({busy: true});
		let thenable = this.props.onSubmit(value);
		if (!thenable) {
			logger.error('onSubmit callback did not return a thenable, this component will never leave the busy state.');
			return;
		}

		thenable
			.catch(()=> {})
			.then(()=> {
				this.setState({busy: false});
			});
	}
});
