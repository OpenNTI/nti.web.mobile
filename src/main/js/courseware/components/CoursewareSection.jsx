/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var IconBar = require('./IconBar');
var CourseList = require('./CourseList');
var CatalogView = require('./CatalogView');
var LibraryCollection = require('../../library/components/Collection');

var CoursewareSection = React.createClass({

	_contentView: function(section) {
		switch (section) {
			case 'courses':
			case 'books':
				return <CourseList section={section} />
			break;

			case 'catalog':
				return <CatalogView />
			break

			default:
				return <div>Unknown section</div>
		}
	},

	render: function() {

		var contentView = this._contentView(this.props.section);

		return (
			<div>
				{this.transferPropsTo(<IconBar />)}
				{contentView}
			</div>
		);
	}

});

module.exports = CoursewareSection;
