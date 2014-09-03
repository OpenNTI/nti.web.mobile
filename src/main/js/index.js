'use strict';
/**
 * @module nt-mobile
 */

//TODO: move jQuery, foundation, typekit to requires()/provides() calls here and out of the html.

global.React = require('react/addons');

//TODO: dispatcher require goes here?
var AppView = require('./main');

React.renderComponent(
	AppView({basePath: $AppConfig.basepath || '/'}),
	document.getElementById('content')
);

$(document).foundation();//Does this need to be called per-component render (scoped to the component)?
