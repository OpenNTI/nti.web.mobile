import React from 'react';

import {PanelButton} from 'nti-web-commons';

import ContextSender from 'common/mixins/ContextSender';
import {Mixins} from 'nti-web-commons';


import {scoped} from 'nti-lib-locale';
let t = scoped('ENROLLMENT.forms.fiveminute');

export default React.createClass({
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
