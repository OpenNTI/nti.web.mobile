import React from 'react';

import createReactClass from 'create-react-class';

import {Mixins, PanelButton} from 'nti-web-commons';

import ContextSender from 'common/mixins/ContextSender';


import {scoped} from 'nti-lib-locale';
let t = scoped('ENROLLMENT.forms.fiveminute');

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
				<h1>{t('prohibitionPolicyHeading')}</h1>
				<p>{t('prohibitionPolicy')}</p>
			</PanelButton>
		);
	}
});
