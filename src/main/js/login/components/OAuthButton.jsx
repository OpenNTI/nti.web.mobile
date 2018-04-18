import Path from 'path';
import Url from 'url';

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import QueryString from 'query-string';
import {scoped} from '@nti/lib-locale';
import {getReturnURL} from '@nti/web-client';
import {Mixins} from '@nti/web-commons';

const t = scoped('app.login.oauth');

function getServiceName (k) {
	return k.split('.')[1].toLowerCase();
}

export default createReactClass({
	displayName: 'OAuthButton',
	mixins: [Mixins.BasePath],

	propTypes: {
		rel: PropTypes.string,
		link: PropTypes.object
	},

	render () {
		let {rel, link: {href, title} = {}, ...props} = this.props;
		let base = this.getBasePath();
		let service = getServiceName(rel);

		href = Url.parse(href);
		href.search = QueryString.stringify(
			Object.assign(
				QueryString.parse(href.search), {
					success: getReturnURL() || base,
					failure: Path.join(base, 'login/')
				}));

		href = href.format();


		Object.assign(props, {
			href,
			className: 'oauth-button ' + service.toLowerCase()
		});

		return (
			<button {...props} onClick={this.handleClick}>
				{t(service, {fallback: title})}
			</button>
		);
	},


	handleClick (e) {
		e.preventDefault();
		e.stopPropagation();

		global.location.replace(e.target.getAttribute('href'));
	}
});
