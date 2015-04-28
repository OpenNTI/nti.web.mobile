import React from 'react';

import PanelButton from 'common/components/PanelButton';

import {scoped} from 'common/locale';
let t = scoped('ENROLLMENT.forms.fiveminute');

export default React.createClass({
	displayName: 'Policy',

	render () {
		return (
			<PanelButton href="../" linkText="Back" className="column">
				<h1>{t('prohibitionPolicyHeading')}</h1>
				<p>{t('prohibitionPolicy')}</p>
			</PanelButton>
		);
	}
});
