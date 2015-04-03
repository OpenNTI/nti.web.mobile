
'use strict';

var React = require('react');
var ButtonPlain = require('common/forms/components/Button');
var ButtonFullWidth = require('common/forms/components/ButtonFullWidth');
var {getBasePath} = require('common/utils');
var {encodeForURI} = require('nti.lib.interfaces/utils/ntiids');
var t = require('common/locale').scoped('ENROLLMENT.BUTTONS');

var RedeemButton = React.createClass({

	propTypes: {
		catalogId: React.PropTypes.string,
		href: React.PropTypes.string
	},

	_urlForEntry: function() {
		var href = getBasePath() + 'catalog/item/' + encodeForURI(this.props.catalogId) + '/enrollment/store/gift/redeem/';
		return href;
	},

	render: function() {

		var href = this.props.href || this._urlForEntry();
		var Button = this.props.fullWidth ? ButtonFullWidth : ButtonPlain;
		return (
			<div>
				<Button className="redeemButton" href={href}>{t('redeemGift')}</Button>
			</div>
		);
	}

});

module.exports = RedeemButton;
