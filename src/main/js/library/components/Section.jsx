/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var IconBar = require('./IconBar');
var List = require('./List');
var Catalog = require('../catalog').View;

module.exports = React.createClass({
	displayName: 'Section',

	propTypes: {
		basePath: React.PropTypes.string.isRequired
	},

	_contentView: function(section) {
		switch (section) {
			case 'courses':
			case 'books':
				return List({section: section});

			case 'catalog':
				return Catalog();

			default:
				return (<div>Unknown section</div>);
		}
	},

	render: function() {

		var contentView = this.transferPropsTo(this._contentView(this.props.section));

		return (
			<div>
				{this.transferPropsTo(<IconBar />)}
				{contentView}
			</div>
		);
	}

});
