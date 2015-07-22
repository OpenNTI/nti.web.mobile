import React from 'react';

import {scoped} from 'common/locale';

import Button from './Button';

const t = scoped('LOGIN');

import {MESSAGE_SIGNUP_CONFIRMATION} from '../Constants';

export default React.createClass({
	displayName: 'SignupConfirm',

	render () {
		return (
			<div>
				<div className="notice simple">
					{t(MESSAGE_SIGNUP_CONFIRMATION)}
				</div>
				<div className="medium-6 medium-centered columns">
					<Button id="signup:confirm:yes" href="/signup/">
						<span>Create Account</span> <i className="fi-arrow-right" />
					</Button>
					<Button id="signup:confirm:no" href="/" className="fi-arrow-left"> Return to Login</Button>
				</div>
			</div>
		);
	}

});
