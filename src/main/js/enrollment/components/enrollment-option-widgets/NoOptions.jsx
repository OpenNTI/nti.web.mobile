import React from 'react';
import Notice from 'common/components/Notice';
import t from 'nti-lib-locale';

export default function NoOptions () {
	return (
		<div>
			<Notice>This course is not currently available for enrollment.</Notice>
			<div className="text-center">
				<a href="../" className="button tiny">{t('BUTTONS.ok')}</a>
			</div>
		</div>
	);
}
