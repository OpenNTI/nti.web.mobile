import PropTypes from 'prop-types';
import React from 'react';

import { scoped } from '@nti/lib-locale';

import { edit } from '../Actions';

const t = scoped('enrollment.confirmation', {
	giftInfo: 'Gift Information',
	from: 'From:',
	to: 'To:',
	message: 'Message:',
});

export default class extends React.Component {
	static displayName = 'GiftInfo';

	static propTypes = {
		info: PropTypes.object,
		edit: PropTypes.any,
	};

	onEdit = e => {
		e.preventDefault();
		e.stopPropagation();
		edit(this.props.edit);
	};

	render() {
		let { info } = this.props;

		if (!info || !info.from) {
			return <div />;
		}

		return (
			<fieldset>
				<div className="title">
					<span>{t('giftInfo')}</span>{' '}
					<a href="#" onClick={this.onEdit}>
						edit
					</a>
				</div>
				<div className="field">
					<span className="label">{t('from')}</span>{' '}
					<span className="value">
						{info.sender
							? info.sender + ' (' + info.from + ')'
							: info.from}
					</span>
				</div>
				{!info.receiver ? (
					''
				) : (
					<div className="field">
						<span className="label">{t('to')}</span>{' '}
						<span className="value">
							{info.to
								? info.to + ' (' + info.receiver + ')'
								: info.receiver}
						</span>
					</div>
				)}
				{!info.message ? (
					''
				) : (
					<div className="field">
						<span className="label">{t('message')}</span>
						<span className="value">{info.message}</span>
					</div>
				)}
			</fieldset>
		);
	}
}
