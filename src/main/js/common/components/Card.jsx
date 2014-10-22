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


External Links:
			NTIID: "tag:nextthought.com,2011-10:OU-RelatedWorkRef-...:library_guide_ou.2"
		creator: "University of Oklahoma Libraries"
			desc: "This guide is designed to provide additional resources to help you study."
			icon: "resources/.../fd35e23767020999111e1f49239199b4c5eff23e.png"
			label: "Library Guide for Human Physiology"
			href: "http://guides.ou.edu/biol2124_humanphysiology"
	target-NTIID: "tag:nextthought.com,2011-10:NTI-UUID-dbbb93c8d79d8de6e1edcbe8685c07c9"
	targetMimeType: "application/vnd.nextthought.externallink"

*/
var path = require('path');
var React = require('react/addons');

var NavigatableMixin = require('../mixins/NavigatableMixin');

var NTIID = require('dataserverinterface/utils/ntiids');
var isNTIID = NTIID.isNTIID;

module.exports = React.createClass({
	mixins: [NavigatableMixin],
	displayName: 'RelatedWorkRef',

	propTypes: {
		/**
		 * The slug to put between the basePath and the resource
		 * target/href/ntiid at the end of the uri.
		 *
		 * @type {String}
		 */
		slug: React.PropTypes.string.isRequired,

		/**
		 * The owning contentPackage to provide a method "resolveContentURL"
		 * @type {Package}
		 */
		contentPackage: React.PropTypes.object.isRequired,

		/**
		 * The object with with all the metadata. Should have properties:
		 *
		 * 	- NTIID
		 * 	- desc
		 * 	- icon
		 * 	- title
		 * 	- label
		 *
		 * @type {Object}
		 */
		item: React.PropTypes.object.isRequired
	},


	getInitialState: function(){
		return {
			icon: null
		};
	},


	componentDidMount: function() {
		this.resolveIcon(this.props);
		this.resolveHref(this.props);
	},


	componentWillReceiveProps: function(props) {
		if (this.props.icon !== props.icon) {
			this.resolveIcon(props);
			this.resolveHref(props);
		}
	},


	resolveHref: function(props) {
		var href = props.item.href;

		if (isNTIID(href)) {
			var link = path.join(
				props.slug || '',
				NTIID.encodeForURI(href)) + '/';

			this.setState({href: this.makeHref(link, true)});
			return;
		}


		this.setState({	href: null });

		props.contentPackage.resolveContentURL(href)
			.then(function(url) {
				this.setState({ href: url });
			}.bind(this));
	},


	resolveIcon: function(props) {
		this.setState({	icon: null	});
		if (!props.item.icon) {
			return;
		}
		props.contentPackage.resolveContentURL(props.item.icon)
			.then(function(u) {
				this.setState({
					iconResolved: true,
					icon: u
				});
			}.bind(this));
	},


	isExternal: function(props) {
		var p = props || this.props;
		return !isNTIID(p.item.href);
	},


	render: function() {
		var state = this.state;
		var item = this.props.item;
		var external = this.isExternal();
		var extern = external ? 'external' : '';

		var icon = {
			backgroundImage: 'url('+state.icon+')'
		};

		return (
			<a className={'content-link related-work-ref ' + extern}
				href={state.href} target={external ? '_blank' : null}
				onClick={this.props.onClick}
			>
				{state.icon?
					<div className="icon" style={icon}/>
				:null}
				<h5 dangerouslySetInnerHTML={{__html: item.title}}/>
				<hr className="break hide-for-medium-up"/>
				<div className="label" dangerouslySetInnerHTML={{__html: item.creator}}/>
				<div className="description" dangerouslySetInnerHTML={{__html: item.desc}}/>
			</a>
		);
	}
});
