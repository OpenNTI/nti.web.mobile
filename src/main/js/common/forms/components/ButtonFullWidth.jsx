/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Button = require('./Button');

var ButtonFullWidth = React.createClass({

	render: function() {
		return (
			<Button {...this.props} className='column'>{this.props.children}</Button>
		);
	}

});

module.exports = ButtonFullWidth;
