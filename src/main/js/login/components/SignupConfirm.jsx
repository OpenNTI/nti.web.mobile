import React from 'react';
import {Link} from 'react-router-component';
import {scoped} from '@nti/lib-locale';

const t = scoped('app.login');

import {MESSAGE_SIGNUP_CONFIRMATION} from '../Constants';

export default function SignupConfirm () {
	return (
		<div className="login-wrapper">
			<div className="login-form no-zoom">
				<div className="header">next thought</div>
				<fieldset>
					<div className="notice">
						{t(MESSAGE_SIGNUP_CONFIRMATION)}
					</div>

					<Link id="signup:confirm:no" href="/" className="return-link"><i className="icon-chevron-left"/> Return to Login</Link>

					<div className="account-creation">
						<Link id="signup:confirm:yes" href="/signup/">
							<span>{t('signup.link')}</span>
						</Link>
					</div>
				</fieldset>
			</div>
		</div>
	);
}
