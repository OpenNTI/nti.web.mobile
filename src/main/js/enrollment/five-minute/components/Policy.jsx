import React from 'react';
import createReactClass from 'create-react-class';
import {Mixins, PanelButton} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import ContextSender from 'common/mixins/ContextSender';


const t = scoped('enrollment.forms.fiveminute.prohibition', {
	heading: 'Policy on Non-Academic Criteria in the Admission of Students',
	policy: 'In addition to the academic criteria used as the basis for the admission of students, the University shall consider the following non-academic criteria in deciding whether a student shall be granted admission: whether an applicant has been expelled, suspended, or denied admission or readmission by any other educational institution; whether an applicant has been convicted of a felony or lesser crime involving moral turpitude; whether an applicant\'s conduct would be grounds for expulsion, suspension, dismissal or denial of readmission, had the student been enrolled at the University of Oklahoma. An applicant may be denied admission to the University if the University determines that there is substantial evidence, based on any of the instances described above, to indicate the applicant\'s unfitness to be a student at the University of Oklahoma.',
});

export default createReactClass({
	displayName: 'Policy',
	mixins: [Mixins.NavigatableMixin, ContextSender],


	getContext () {
		let href = this.makeHref('');
		return Promise.resolve([ { label: 'Policy', href } ]);
	},


	render () {
		return (
			<PanelButton href="../" linkText="Back" className="column">
				<h1>{t('heading')}</h1>
				<p>{t('policy')}</p>
			</PanelButton>
		);
	}
});
