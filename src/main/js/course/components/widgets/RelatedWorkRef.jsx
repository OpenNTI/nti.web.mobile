/** @jsx React.DOM */
'use strict';
/*
Internal Links:
			 NTIID: "tag:nextthought.com,2011-10:OU-RelatedWorkRef...:digestion_and_metabolism_textbook1"
		   creator: "Openstax, Heather Ketchum, and Eric Bright"
			  desc: "Read this material about Digestion and Metabolism."
			  icon: "resources/.../fd35e23767020999111e1f49239199b4c5eff23e.png"
			 label: "Digestion and Metabolism Textbook Reading 1"
			  href: "tag:nextthought.com,2011-10:OU-HTML-...:digestion_and_metabolism_textbook1"
	  target-NTIID: "tag:nextthought.com,2011-10:OU-HTML-...:digestion_and_metabolism_textbook1"
	targetMimeType: "application/vnd.nextthought.content"
		visibility: "everyone"

External Links:
			 NTIID: "tag:nextthought.com,2011-10:OU-RelatedWorkRef-...:library_guide_ou.2"
		   creator: "University of Oklahoma Libraries"
			  desc: "This guide is designed to provide additional resources to help you study."
			  icon: "resources/.../fd35e23767020999111e1f49239199b4c5eff23e.png"
			 label: "Library Guide for Human Physiology"
			  href: "http://guides.ou.edu/biol2124_humanphysiology"
	  target-NTIID: "tag:nextthought.com,2011-10:NTI-UUID-dbbb93c8d79d8de6e1edcbe8685c07c9"
	targetMimeType: "application/vnd.nextthought.externallink"
		visibility: "everyone"
*/
var React = require('react/addons');
var NTIID = require('dataserverinterface/utils/ntiids');
var Card = require('common/components/Card');
var path = require('path');

module.exports = React.createClass({
	displayName: 'CourseOverviewRelatedWorkRef',

	statics: {
		mimeTest: /^application\/vnd\.nextthought\.relatedworkref/i,
		handles: function(item) {
			return this.mimeTest.test(item.MimeType);
		}
	},


	render: function() {
		var props = this.props;
		var item = props.item;

		//map fields for the card
		item.title = item.label;

		return this.transferPropsTo(
			<Card slug="c" contentPackage={props.course}/>
		);
	}
});
