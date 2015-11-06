import React from 'react';
import cx from 'classnames';

import Button from 'common/forms/components/Button';
import BasePathAware from 'common/mixins/BasePath';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';
import {scoped} from 'common/locale';

const t = scoped('ENROLLMENT.BUTTONS');

export default React.createClass({
	displayName: 'Giftable',
	mixins: [BasePathAware],

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
			<Button className={cx('giftable', className)} href={href}>{t('giveThisAsGift')}</Button>
		);
	}

});
