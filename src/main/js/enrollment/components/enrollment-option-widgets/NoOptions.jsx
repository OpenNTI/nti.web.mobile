import React from 'react';
import PanelButton from 'common/components/PanelButton';
import t from 'common/locale';

export default React.createClass({

	displayName: 'envrollment:NoOptions',

	render: function() {
		return (
			<PanelButton href="../" linkText={t('BUTTONS.ok')}>
				This course is not currently available for enrollment.
			</PanelButton>
		);
	}

});
