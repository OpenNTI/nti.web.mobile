import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

import Button from 'common/forms/components/Button';

import t from 'common/locale';

import BasePathAware from 'common/mixins/BasePath';

import {links as LinkConstants} from '../Constants';



// shortcut for getting the service name off the oauth constants
// (e.g. 'google' from 'OAUTH_LINK_GOOGLE')
function getServiceName(k) {
	return k.split('_').pop().toLowerCase();
}

const OAuthButton = React.createClass({
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

export default React.createClass({
	displayName: 'OAuthButtons',

	render () {

		// filter the list of LoginConstants to include those that
		// begin with OAUTH_LINK
		let authlinks = Object.keys(LinkConstants)
			.filter(k =>k.indexOf('OAUTH_LINK') === 0);

		let buttons = [];
		let props = this.props;

		return (
			<div>
				<div>
					<ReactCSSTransitionGroup transitionName="button">
						{authlinks.forEach(linkKey => {
							if (LinkConstants[linkKey] in props.links) {
								buttons.push(
									<OAuthButton
										id={'login:rel:' + LinkConstants[linkKey]}
										linkKey={linkKey}
										link={props.links[LinkConstants[linkKey]]}
										className={props.buttonClass} />
								);
							}
						})}
					</ReactCSSTransitionGroup>
				</div>
			</div>
		);

	}

});
