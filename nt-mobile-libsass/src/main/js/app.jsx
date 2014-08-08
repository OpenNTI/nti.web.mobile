/** @jsx React.DOM */

'use strict';

var React = require('react/addons');

var Nav = require('./components/Nav');

React.renderComponent(<Nav />, document.getElementById('content'));

$(document).foundation();
