import './View.scss';
import React, { Suspense, useState } from 'react';
import cx from 'classnames';

import Logger from '@nti/util-logger';
import { Loading } from '@nti/web-commons';
import { getAppUser, getReturnURL } from '@nti/web-client';
import { Button } from '@nti/web-core';

import UserAgreement from './UserAgreement';

const logger = Logger.get('terms:components:View');

export default function TermsOfServiceAcceptance() {
	const [agree, setAgree] = useState(false);
	const [busy, setBusy] = useState(false);

	const acceptTermsOfService = async () => {
		if (!agree) {
			return;
		}

		setBusy(true);

		getAppUser()
			.then(u => u.acceptTermsOfService())
			.catch(e => logger.trace(e))
			.then(() => global.location.replace(getReturnURL()));
	};

	const disabled = !agree || busy;

	return (
		<div className="terms-of-service-prompt">
			<header className="tos-header">
				<h3>
					We recently updated our Terms of Service and Privacy Policy.
				</h3>
				<div className="you-should">
					Please take a moment to read them carefully.
				</div>
			</header>
			<Suspense fallback={<Loading.Mask />}>
				<UserAgreement />
			</Suspense>
			<footer>
				<label>
					<input
						type="checkbox"
						checked={agree}
						onChange={e => setAgree(e.target.checked)}
					/>
					<span>
						{' '}
						Yes, I agree to the Terms of Service and Privacy Policy.
					</span>
				</label>
				<Button
					className={cx({ disabled })}
					disabled={disabled}
					onClick={acceptTermsOfService}
				>
					I Agree
				</Button>
			</footer>
		</div>
	);
}
