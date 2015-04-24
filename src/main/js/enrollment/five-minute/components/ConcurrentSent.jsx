import React from 'react'
;
import PanelButton from 'common/components/PanelButton';
import {scoped} from 'common/locale';

const t = scoped('ENROLLMENT');

export default React.createClass({
	displayName: 'ConcurrentSent',

	render () {
		return (

			<PanelButton href='../../../' linkText="Back">
				<h2>{t('concurrentThanksHead')}</h2>
				<p dangerouslySetInnerHTML={{__html: t('concurrentThanksBody')}} />
			</PanelButton>
		);
	}

});
