import React from 'react';
import {Notice} from '@nti/web-commons';
import t from '@nti/lib-locale';

export default function NoOptions () {
	return (
		<div>
			<Notice>This course is not currently available for enrollment.</Notice>
			<div className="text-center">
				<a href="../../" className="button tiny">{t('common.buttons.ok')}</a>
			</div>
		</div>
	);
}
