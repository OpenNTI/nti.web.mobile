import './UserAgreement.scss';

import { getServer } from '@nti/web-client';
import { rawContent } from '@nti/lib-commons';
import { useAsyncValue } from '@nti/web-core';
import { useBasePath } from '@nti/web-routing';

const getUserAgreement = url => {
	return getServer()
		.get(url)
		.catch(er =>
			Promise.reject(er.responseJSON ? er.responseJSON.message : er)
		);
};

export default function UserAgreement() {
	const basePath = useBasePath();
	const url = basePath + '/api/user-agreement/';
	const { body, styles = '' } = useAsyncValue(url, () =>
		getUserAgreement(url)
	);

	const alteredStyles = styles
		//do not import other sheets.
		.replace(/@import[^;]*;/g, '')
		//do not allow margin rules:
		.replace(/(margin)([^:]*):([^;]*);/g, '');

	if (!body) {
		throw new Error(`Could not load user agreement from ${url}`);
	}

	return (
		<div className="agreement-wrapper">
			<div className="agreement">
				<style type="text/css" scoped {...rawContent(alteredStyles)} />
				<div {...rawContent(body)} />
			</div>
		</div>
	);
}
