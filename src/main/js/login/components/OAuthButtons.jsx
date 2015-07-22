import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

// import {links as LinkConstants} from '../Constants';

import OAuthButton from './OAuthButtons';

export default React.createClass({
	displayName: 'OAuthButtons',

	render () {

		// filter the list of LoginConstants to include those that
		// begin with OAUTH_LINK
		let authlinks = []
			.filter(k =>k.indexOf('OAUTH_LINK') === 0);

		let buttons = [];
		let props = this.props;

		return (
			<div>
				<div>
					<ReactCSSTransitionGroup transitionName="button">
						{authlinks.forEach(linkKey => {

							buttons.push(
								<OAuthButton
									id={'login:rel:' + linkKey}
									linkKey={linkKey}
									link={props.links[linkKey]}
									className={props.buttonClass} />
							);

						})}
					</ReactCSSTransitionGroup>
				</div>
			</div>
		);

	}

});
