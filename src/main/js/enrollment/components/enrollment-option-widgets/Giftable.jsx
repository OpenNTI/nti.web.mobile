'use strict';

var React = require('react');
var ButtonPlain = require('common/forms/components/Button');
var ButtonFullWidth = require('common/forms/components/ButtonFullWidth');
var {getBasePath} = require('common/utils');
var NTIID = require('dataserverinterface/utils/ntiids');
var t = require('common/locale').scoped('ENROLLMENT.BUTTONS');

var Giftable = React.createClass({

	propTypes: {
		catalogId: React.PropTypes.string,
		href: React.PropTypes.string
	},

	_urlForEntry: function() {
		var href = getBasePath() + 'library/catalog/item/' + NTIID.encodeForURI(this.props.catalogId) + '/enrollment/store/gift/';
		return href;
	},

	render: function() {

		var href = this.props.href || this._urlForEntry();
		var Button = this.props.fullWidth ? ButtonFullWidth : ButtonPlain;

		return (
			<div>
				<Button className="giftable" href={href}>{t('giveThisAsGift')}</Button>
			</div>
		);
	}

});

module.exports = Giftable;
