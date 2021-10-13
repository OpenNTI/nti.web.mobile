
import Store from '../Store';

import OAuthButton from './OAuthButton';

export default function OAuthButtons() {
	const links = Store.getAvailableOAuthLinks();
	const rels = Object.keys(links);

	return rels.length === 0 ? (
		<div />
	) : (
		<div className="oauth-login">
			{rels.map(rel => (
				<OAuthButton
					id={'login:rel:' + rel}
					key={rel}
					rel={rel}
					link={links[rel]}
				/>
			))}
		</div>
	);
}
