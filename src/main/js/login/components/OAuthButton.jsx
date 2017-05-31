import React from 'react';

import createReactClass from 'create-react-class';

import Path from 'path';
import Url from 'url';
import PropTypes from 'prop-types';
import QueryString from 'query-string';

import Button from 'forms/components/Button';

import {scoped} from 'nti-lib-locale';
import {getReturnURL} from 'nti-web-client';

import {Mixins} from 'nti-web-commons';

const t = scoped('LOGIN.oauth');

function getServiceName (k) {
	return k.split('.')[1].toLowerCase();
}

export default createReactClass({
	displayName: 'OAuthButton',
	mixins: [Mixins.BasePath],

	propTypes: {
		rel: PropTypes.string,
		href: PropTypes.string
	},

	render () {
		let {rel, href} = this.props;
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


		let props = Object.assign({}, this.props, {
			href,
			className: 'oauth-button ' + service.toLowerCase()
		});

		return (
			<Button {...props} onClick={this.handleClick}>
				{t(service)}
			</Button>
		);
	},


	handleClick (e) {
		e.preventDefault();
		e.stopPropagation();

		location.replace(e.target.getAttribute('href'));
	}
});
