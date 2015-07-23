import React from 'react';

import OAuthButton from './OAuthButtons';



export default React.createClass({
	displayName: 'OAuthButtons',

	render () {

		let authlinks = [];

		return (
			<div>
				{authlinks.map(linkKey =>

					<OAuthButton id={'login:rel:' + linkKey} />

				)}
			</div>
		);

	}

});
