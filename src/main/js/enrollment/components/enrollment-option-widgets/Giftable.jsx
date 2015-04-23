import React from 'react';
import ButtonPlain from 'common/forms/components/Button';
import ButtonFullWidth from 'common/forms/components/ButtonFullWidth';
import BasePathAware from 'common/mixins/BasePath';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';
import {scoped} from 'common/locale';

const t = scoped('ENROLLMENT.BUTTONS');

export default React.createClass({
	displayName: 'Giftable',
	mixins: [BasePathAware],

	propTypes: {
		catalogId: React.PropTypes.string,
		href: React.PropTypes.string,

		fullWidth: React.PropTypes.bool
	},

	getUrlForEntry () {
		let href = this.getBasePath() + 'catalog/item/' + encodeForURI(this.props.catalogId) + '/enrollment/store/gift/';
		return href;
	},

	render () {

		let href = this.props.href || this.getUrlForEntry();
		let Button = this.props.fullWidth ? ButtonFullWidth : ButtonPlain;

		return (
			<div>
				<Button className="giftable" href={href}>{t('giveThisAsGift')}</Button>
			</div>
		);
	}

});
