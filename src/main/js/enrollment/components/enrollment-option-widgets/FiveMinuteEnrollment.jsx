import React from 'react';
import PanelButton from 'common/components/PanelButton';
import {scoped} from 'common/locale';

const t = scoped('ENROLLMENT');

import {isFlag} from 'common/utils';

export default React.createClass({
	displayName: 'FiveMinuteEnrollment',

	statics: {
		re: /FiveMinuteEnrollment/i,//The server sends lower case M, but we're comparing case-insensitively.
		handles (options) {
			return isFlag('fiveMinuteEnabled') && this.re.test(options && options.key);
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
