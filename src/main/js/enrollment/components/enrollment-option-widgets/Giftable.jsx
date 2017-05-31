import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import cx from 'classnames';

import {Mixins} from 'nti-web-commons';

import {encodeForURI} from 'nti-lib-ntiids';
import {scoped} from 'nti-lib-locale';

const t = scoped('ENROLLMENT.BUTTONS');

export default createReactClass({
	displayName: 'Giftable',
	mixins: [Mixins.BasePath],

	propTypes: {
		className: PropTypes.string,
		catalogId: PropTypes.string,
		href: PropTypes.string
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
