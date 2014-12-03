/** @jsx React.DOM */

'use strict';

var React = require('react/addons');
var Button = require('common/forms/Button');
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
		// if (!isFlag('dev')) {
		// 	return null;
		// }

		var href = this.props.href || this._urlForEntry();
		return (
			<div>
				<Button className="giftable" href={href}>{t('giveThisAsGift')}</Button>
			</div>
		);
	}

});

module.exports = Giftable;
