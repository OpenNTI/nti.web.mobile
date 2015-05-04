import React from 'react';
import PanelButton from 'common/components/PanelButton';
import {scoped} from 'common/locale';

const t = scoped('ENROLLMENT');

export default React.createClass({
	displayName: 'FiveMinuteEnrollment',

	statics: {
		re: /fiveminuteenrollmentoption/i,//The server sends lower case M, but we're comparing case-insensitively.
		handles (option) {
			return this.re.test(option && option.MimeType);
		}
	},

	render () {
		return (
			<PanelButton href="credit/" linkText={t('fiveMinuteEnrollmentButton')}>
				<h2>{t('fiveMinuteEnrollmentTitle')}</h2>
				<p>{t('fiveMinuteEnrollmentDescription')}</p>
			</PanelButton>
		);
	}

});
