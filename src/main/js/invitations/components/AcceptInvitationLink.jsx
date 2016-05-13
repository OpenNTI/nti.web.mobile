import React from 'react';
import {join} from 'path';

import BasePath from 'common/mixins/BasePath';

import {canAccept} from '../Api';

export default React.createClass({
	displayName: 'AcceptInvitationLink',

	mixins: [BasePath],

	getInitialState () {
		return {
			loading: true
		};
	},

	componentWillMount () {
		canAccept()
		.then(result => this.setState({
			loading: false,
			accept: result
		}));
	},

	render () {
		const {loading, accept} = this.state;
		const href = join(this.getBasePath(), 'catalog', 'code', '/');
		if (loading) {
			return null;
		}
		return accept ? <a href={href} className="accept-invitation-link">Accept Invitation</a> : null;
	}
});
