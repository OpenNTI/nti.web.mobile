/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var _t = require('common/locale');

module.exports = React.createClass({
	displayName: 'LocalizedHTML',

	propTypes: {
		key: React.PropTypes.string.isRequired,
		scoped: React.PropTypes.string
	},

	render: function() {
		var _t2 = _t.scoped(this.props.scoped || '');

		return (
			<div className={this.props.className} dangerouslySetInnerHTML={{__html: _t2(this.props.key, this.props)}} />
		);
	}
});
