import React from 'react';

import {Link} from 'react-router-component';

import {scoped} from 'common/locale';


const t = scoped('LOGIN');

import {MESSAGE_SIGNUP_CONFIRMATION} from '../Constants';

export default React.createClass({
	displayName: 'SignupConfirm',

	render () {
		return (
			<div className="login-wrapper">
				<div className="login-form no-zoom">
					<div className="header">next thought</div>
					<fieldset>
						<div className="notice">
							{t(MESSAGE_SIGNUP_CONFIRMATION)}
						</div>

						<Link id="signup:confirm:no" href={'/' + location.search} className="return-link fi-arrow-left"> Return to Login</Link>

						<div className="account-creation">
							<Link id="signup:confirm:yes" href={'/signup/' + location.search}>
								<span>Create an Account</span> <i className="fi-arrow-right" />
							</Link>
						</div>
					</fieldset>
				</div>
			</div>
		);
	}

});
