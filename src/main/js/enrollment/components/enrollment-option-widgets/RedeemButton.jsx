import React from 'react';
import cx from 'classnames';

import BasePathAware from 'common/mixins/BasePath';

import {encodeForURI} from 'nti-lib-ntiids';
import {scoped} from 'common/locale';

const t = scoped('ENROLLMENT.BUTTONS');

export default React.createClass({
	displayName: 'RedeemButton',
	mixins: [BasePathAware],

	propTypes: {
		className: React.PropTypes.string,
		catalogId: React.PropTypes.string,
		href: React.PropTypes.string
	},

	urlForEntry () {
		return this.getBasePath() + 'catalog/redeem/' + encodeForURI(this.props.catalogId) + '/';
	},

	render () {
		const {props: {className, href = this.urlForEntry()}} = this;

		return (
			<a className={cx('redeem-button', className)} href={href}>{t('redeemGift')}</a>
		);
	}

});
