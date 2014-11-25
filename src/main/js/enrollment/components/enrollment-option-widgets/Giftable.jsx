/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Button = require('common/components/forms/Button');
var getBasePath = require('common/Utils').getBasePath;
var t = require('common/locale').scoped('ENROLLMENT.BUTTONS');

var Giftable = React.createClass({

	propTypes: {
		catalogId: React.PropTypes.string,
		href: React.PropTypes.string
	},

	_urlForEntry: function() {
		return './store/gift/';
	},

	render: function() {
		var href = this.props.href || this._urlForEntry();
		return (
			<div class="row">
				<Button className="giftable" href={href}>{t('giveThisAsGift')}</Button>
			</div>
		);
	}

});

module.exports = Giftable;
