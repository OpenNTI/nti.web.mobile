import React from 'react';
import {scoped} from 'nti-lib-locale';
import {rawContent} from 'nti-commons';

const t = scoped('ENROLLMENT');

export default function ConcurrentSent () {
	return (
		<div className="enrollment-pending">
			<figure className="notice">
				<div>
					<h2>{t('concurrentThanksHead')}</h2>
					<span {...rawContent(t('concurrentThanksBody'))} />
				</div>
			</figure>
			<a className="button tiny" href="../../../">Back</a>
		</div>
	);
}
