import React from 'react';
import {scoped} from 'nti-lib-locale';

import BasePathAware from 'common/mixins/BasePath';
import ContextSender from 'common/mixins/ContextSender';

import AcceptInvitation from './Accept';

let t = scoped('INVITATIONS');

export default React.createClass({
	displayName: 'InvitationsView',

	mixins: [BasePathAware, ContextSender],

	getContext () {
		const path = this.getBasePath();
		const href = '/accept/';
		return Promise.resolve([
			{
				href: path, label: 'Library'
			}, {
				href,
				label: t('title')
			}
		]);
	},

	render () {
		return (
			<AcceptInvitation {...this.props}/>
		);
	}
});
