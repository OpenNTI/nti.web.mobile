import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

import {links as LinkConstants} from '../Constants';

import OAuthButton from './OAuthButtons';

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
