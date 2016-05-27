import React from 'react';
import cx from 'classnames';

import {Mixins} from 'nti-web-commons';

import {encodeForURI} from 'nti-lib-ntiids';
import {scoped} from 'nti-lib-locale';

const t = scoped('ENROLLMENT.BUTTONS');

export default React.createClass({
	displayName: 'Giftable',
	mixins: [Mixins.BasePath],

	propTypes: {
		className: React.PropTypes.string,
		catalogId: React.PropTypes.string,
		href: React.PropTypes.string
	},

	getUrlForEntry () {
		return `${this.getBasePath()}catalog/gift/purchase/${encodeForURI(this.props.catalogId)}/`;
	},

	render () {
		const {props: {className, href = this.getUrlForEntry()}} = this;

		return (
			<a className={cx('giftable', className)} href={href}>{t('giveThisAsGift')}</a>
		);
	}

});
