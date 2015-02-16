import React from 'react/addons';
import Button from 'common/forms/components/Button';
import {translate as t} from 'common/locale';
import BasePathAware from 'common/mixins/BasePath';
import Constants from '../Constants';

const LinkConstants = Constants.links;//constants isn't es6 module yet

const ReactCSSTransitionGroup = require("react/lib/ReactCSSTransitionGroup");


// shortcut for getting the service name off the oauth constants
// (e.g. 'google' from 'OAUTH_LINK_GOOGLE')
function _serviceName(k) {
	return k.split('_').pop().toLowerCase();
}

var OAuthButton = React.createClass({
	mixins: [BasePathAware],

	render () {
		// linkKey is the property name of the link (as in 'logon.google').
		// 'key' is used by react components as an identifier so we use this
		// admittedly clumsy alternative 'linkKey'.
		var lkey = this.props.linkKey;
		var base = encodeURIComponent(this.getBasePath());
		return (
			<Button {...this.props}
				href={this.props.link + '&success=' + base + '&failure=' + base}
				className={lkey.toLowerCase()}
				key={lkey}
			>
				{t('LOGIN.oauth.login', {service: _serviceName(lkey)})}
			</Button>
		);
	}
});

export default React.createClass({

	render () {

		// filter the list of LoginConstants to include those that
		// begin with OAUTH_LINK
		var authlinks = Object.keys(LinkConstants)
			.filter(k =>k.indexOf('OAUTH_LINK') === 0);

		var buttons = [];
		var props = this.props;

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
