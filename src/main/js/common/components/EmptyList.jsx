/** @jsx React.DOM */
'use strict';
var React = require('react/addons');
var t = require('../locale').scoped('FILTER');
var Notice = require('./Notice');

var EmptyList = React.createClass({

	render: function() {
		return (
			<Notice>{t('empty_list')}</Notice>
		);
	}

});


module.exports = EmptyList;
