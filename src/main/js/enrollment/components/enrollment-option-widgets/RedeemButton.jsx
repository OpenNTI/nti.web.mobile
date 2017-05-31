import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import cx from 'classnames';

import {Mixins} from 'nti-web-commons';

import {encodeForURI} from 'nti-lib-ntiids';
import {scoped} from 'nti-lib-locale';

const t = scoped('ENROLLMENT.BUTTONS');

export default createReactClass({
	displayName: 'RedeemButton',
	mixins: [Mixins.BasePath],

	propTypes: {
		className: PropTypes.string,
		catalogId: PropTypes.string,
		href: PropTypes.string
	},

	urlForEntry () {
		return this.getBasePath() + 'catalog/item/' + encodeForURI(this.props.catalogId) + '/redeem/';
	},

	render () {
		const {props: {className, href = this.urlForEntry()}} = this;

		return (
			<a className={cx('redeem-button', className)} href={href}>{t('redeemGift')}</a>
		);
	}

});
