import React from 'react';

import Button from 'common/forms/components/Button';

import t from 'common/locale';

import BasePathAware from 'common/mixins/BasePath';

// shortcut for getting the service name off the oauth constants
// (e.g. 'google' from 'OAUTH_LINK_GOOGLE')
function getServiceName(k) {
	return k.split('_').pop().toLowerCase();
}

export default React.createClass({
	displayName: 'OAuthButton',
	mixins: [BasePathAware],

	propTypes: {
		linkKey: React.PropTypes.string,
		link: React.PropTypes.string
	},

	render () {
		// linkKey is the property name of the link (as in 'logon.google').
		// 'key' is used by react components as an identifier so we use this
		// admittedly clumsy alternative 'linkKey'.
		let lkey = this.props.linkKey;
		let base = encodeURIComponent(this.getBasePath());
		return (
			<Button {...this.props}
				href={this.props.link + '&success=' + base + '&failure=' + base}
				className={lkey.toLowerCase()}
				key={lkey}
			>
				{t('LOGIN.oauth.login', {service: getServiceName(lkey)})}
			</Button>
		);
	}
});
