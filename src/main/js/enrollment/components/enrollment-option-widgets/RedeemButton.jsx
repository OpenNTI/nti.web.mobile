import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import cx from 'classnames';
import {Mixins} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

const t = scoped('enrollment.buttons', {
	redeemGift: 'Redeem a gift',
});

export default createReactClass({
	displayName: 'RedeemButton',
	mixins: [Mixins.BasePath],

	propTypes: {
		className: PropTypes.string,
		catalogId: PropTypes.string,
		href: PropTypes.string
	},

	urlForEntry () {
		return this.getBasePath() + 'catalog/redeem/';
	},

	render () {
		const {props: {className, href = this.urlForEntry()}} = this;

		return (
			<a className={cx('redeem-button', className)} href={href}>{t('redeemGift')}</a>
		);
	}

});
