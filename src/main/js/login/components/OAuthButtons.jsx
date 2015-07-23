import React from 'react';

import OAuthButton from './OAuthButton';

import Store from '../Store';

export default React.createClass({
	displayName: 'OAuthButtons',

	render () {
		let links = Store.getAvailableOAuthLinks();
		let rels = Object.keys(links);

		return rels.length === 0 ? null : (
			<div className="oauth-login">
				{rels.map(rel =>

					<OAuthButton id={'login:rel:' + rel} key={rel} rel={rel} href={links[rel]} />

				)}
			</div>
		);

	}

});
