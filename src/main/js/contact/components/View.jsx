/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var ContactForm = require('./ContactForm');
var Configs = require('../configs');
var ContactForm = require('./ContactForm');
var Utils = require('common/Utils');

var View = React.createClass({

	render: function() {

		var config = Configs[this.props.configname] || Configs.defaultConfig;
		var basePath = Utils.getBasePath();

		return (<ContactForm basePath={basePath} fieldConfig={config}/>);
	}

});

module.exports = View;
