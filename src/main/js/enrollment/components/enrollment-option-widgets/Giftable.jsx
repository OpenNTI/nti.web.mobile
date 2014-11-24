/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');

var Giftable = React.createClass({

	render: function() {
		return (
			<div className="giftable"><p>Give this as a gift.</p></div>
		);
	}

});

module.exports = Giftable;
