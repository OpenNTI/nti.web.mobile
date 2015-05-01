import React from 'react';

import PanelButton from 'common/components/PanelButton';

import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';


import {scoped} from 'common/locale';
let t = scoped('ENROLLMENT.forms.fiveminute');

export default React.createClass({
	displayName: 'Policy',
	mixins: [NavigatableMixin, ContextSender],


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
