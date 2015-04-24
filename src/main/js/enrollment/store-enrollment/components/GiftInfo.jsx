import React from 'react';

import {edit} from '../Actions';

import {scoped} from 'common/locale';

const t = scoped('ENROLLMENT.CONFIRMATION');

export default React.createClass({
	displayName: 'GiftInfo',

	propTypes: {
		info: React.PropTypes.object.isRequired,
		edit: React.PropTypes.any
	},


	onEdit (e) {
		e.preventDefault();
		e.stopPropagation();
		edit(this.props.edit);
	},


	render () {
		let {info} = this.props;

		if (!info || !info.from) {
			return (<div/>);
		}

		return (
			<fieldset>
				<div className="title">
					<span>{t('giftInfo')}</span> <a href="#" onClick={this.onEdit}>edit</a>
				</div>
				<div className="field">
					<span className="label">{t('from')}</span>	<span className="value">
						{info.sender ? info.sender + ' (' + info.from + ')' : info.from}</span>
				</div>
				{!info.receiver ? '' :
					<div className="field">
						<span className="label">{t('to')}</span> <span className="value">
							{info.to ? info.to + ' (' + info.receiver + ')' : info.receiver}</span>
					</div>
				}
				{!info.message ? '' :
					<div className="field">
						<span className="label">{t('message')}</span>
						<span className="value">{info.message}</span>
					</div>
				}
			</fieldset>
		);
	}
});
