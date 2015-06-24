import React from 'react';

import cx from 'classnames';

import {Editor} from 'modeled-content';

import t from 'common/locale';

export default React.createClass({
	displayName: 'ReplyEditor',

	onChange () {},

	onCancel () {
		this.props.onCancel();
	},

	onSubmit () {},

	render () {
		let value = '';

		let disabled = Editor.isEmpty(value);

		return (
			<div>
				<Editor ref="editor" value={value} onChange={this.onChange} onBlur={this.onChange}>
					<button onClick={this.onCancel} className={`cancel`}>{t('BUTTONS.cancel')}</button>
					<button onClick={this.onSubmit} className={cx('save', {disabled})}>{t('BUTTONS.save')}</button>
				</Editor>
			</div>
		);
	}
});
