import React from 'react';
import {scoped} from '@nti/lib-locale';
import {rawContent} from '@nti/lib-commons';

const t = scoped('enrollment.concurrent', {
	heading: 'Thank you for your interest in concurrent enrollment.',
	body: 'We’ve received your contact information and a Concurrent Enrollment Counselor will ' +
		'be contacting you shortly. In the meantime, please feel free to explore the ' +
		'<a href="http://www.ou.edu/concurrent/admission.html">Concurrent Enrollment website</a> ' +
		'to learn more about the process.',
});

export default function ConcurrentSent () {
	return (
		<div className="enrollment-pending">
			<figure className="notice">
				<div>
					<h2>{t('heading')}</h2>
					<span {...rawContent(t('body'))} />
				</div>
			</figure>
			<a className="button tiny" href="../../../">Back</a>
		</div>
	);
}
