import path from 'path';

import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { getReturnURL } from '@nti/web-client';
import { Mixins } from '@nti/web-commons';

const t = scoped('app.login.oauth');

function getServiceName(k) {
	return k.split('.')[1].toLowerCase();
}

export default createReactClass({
	displayName: 'OAuthButton',
	mixins: [Mixins.BasePath],

	propTypes: {
		rel: PropTypes.string,
		link: PropTypes.object,
	},

	render() {
		let { rel, link: { href, title } = {}, ...props } = this.props;
		let base = this.getBasePath();
		let service = getServiceName(rel);

		const url = new URL(href, global.location);
		url.searchParams.set('success', getReturnURL() || base);
		url.searchParams.set('failure', path.join(base, 'login/'));

		Object.assign(props, {
			href: url.toString(),
			className: 'oauth-button ' + service.toLowerCase(),
		});

		return (
			<button {...props} onClick={this.handleClick}>
				{t(service, { fallback: title })}
			</button>
		);
	},

	handleClick(e) {
		e.preventDefault();
		e.stopPropagation();

		global.location.replace(e.target.getAttribute('href'));
	},
});
