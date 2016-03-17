import React from 'react';
import {scoped} from '../locale';

const t = scoped('LISTS');

export default function NoMatches () {
	return (
		<div className="notice nomatches">
			{t('noMatches')}
		</div>
	);
}
