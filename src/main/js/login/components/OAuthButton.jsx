import React from 'react';

import Path from 'path';
import Url from 'url';
import QueryString from 'query-string';

import Button from 'common/forms/components/Button';

import {scoped} from 'common/locale';
import {getReturnURL} from 'common/utils';

import BasePathAware from 'common/mixins/BasePath';

const t = scoped('LOGIN.oauth');

function getServiceName (k) {
	return k.split('.')[1].toLowerCase();
}

export default React.createClass({
	displayName: 'OAuthButton',
	mixins: [BasePathAware],

	propTypes: {
		rel: React.PropTypes.string,
		href: React.PropTypes.string
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
