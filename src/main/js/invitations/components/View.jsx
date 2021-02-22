import React from 'react';
import createReactClass from 'create-react-class';
import { scoped } from '@nti/lib-locale';
import { Mixins } from '@nti/web-commons';

import ContextSender from 'common/mixins/ContextSender';

import AcceptInvitation from './Accept';

const t = scoped('invitations.view', {
	title: 'Invitation',
});

export default createReactClass({
	displayName: 'InvitationsView',

	mixins: [Mixins.BasePath, ContextSender],

	getContext() {
		const path = this.getBasePath();
		const href = '/accept/';
		return Promise.resolve([
			{
				href: path,
				label: 'Library',
			},
			{
				href,
				label: t('title'),
			},
		]);
	},

	render() {
		return <AcceptInvitation {...this.props} />;
	},
});
