'use strict';

var React = require('react/addons');
var Button = require('common/forms/components/Button');
var ButtonFullWidth = require('common/forms/components/ButtonFullWidth');
var Utils = require('common/Utils');
var NTIID = require('dataserverinterface/utils/ntiids');
var t = require('common/locale').scoped('ENROLLMENT.BUTTONS');

// var isFlag = Utils.isFlag;

var Giftable = React.createClass({

	propTypes: {
		catalogId: React.PropTypes.string,
		href: React.PropTypes.string
	},

	_urlForEntry: function() {
		var href = Utils.getBasePath() + 'library/catalog/item/' + NTIID.encodeForURI(this.props.catalogId) + '/enrollment/store/gift/';
		return href;
	},

	render: function() {

		var href = this.props.href || this._urlForEntry();
		var btn = this.props.fullWidth ? ButtonFullWidth : Button;

		return (
			<div>
				<btn className="giftable" href={href}>{t('giveThisAsGift')}</btn>
			</div>
		);
	}

});

module.exports = Giftable;
