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
import path from 'path';
import React from 'react';
import emptyFunction from 'react/lib/emptyFunction';

import NavigatableMixin from '../mixins/NavigatableMixin';

import {BLANK_IMAGE} from 'common/constants/DataURIs';

import {isNTIID, encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

const Progress = Symbol.for('Progress');

export default React.createClass({
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
		item: React.PropTypes.object.isRequired,

		/**
		 * Allow the parent to force this card to be an "internal" link.
		 * @type {Boolean}
		 */
		internalOverride: React.PropTypes.bool,

		/**
		 * Allow the parent to have final word on the resolved url.
		 * The functoin must take one argument, and return a string.
		 * @type {Function}
		 */
		resolveUrlHook: React.PropTypes.func
	},


	getInitialState (){
		return {
			icon: null
		};
	},


	getDefaultProps () {
		return {
			internalOverride: false,
			resolveUrlHook: emptyFunction.thatReturnsArgument
		};
	},


	componentDidMount () {
		this.resolveIcon(this.props);
		this.resolveHref(this.props);
	},


	componentWillReceiveProps (props) {
		if (this.props.icon !== props.icon) {
			this.resolveIcon(props);
			this.resolveHref(props);
		}
	},


	resolveHref (props) {
		var href = props.item.href;

		if (isNTIID(href)) {
			var link = path.join(
				props.slug || '',
				encodeForURI(href)) + '/';

			this.setState({href: this.makeHref(link, true)});
			return;
		}


		this.setState({	href: null });

		props.contentPackage.resolveContentURL(href)
			.then(url=>props.resolveUrlHook(url))
			.then(url=>{
				this.setState({ href: url });
			});
	},


	resolveIcon (props) {
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


	isExternal (props) {
		var p = props || this.props;
		var {item, internalOverride} = p;

		return !isNTIID(item.href) && !internalOverride;
	},


	isSeen () {
		let progress = this.props.item[Progress];
		return progress && progress.hasProgress();
	},


	render () {
		let {state} = this;
		let {item} = this.props;
		let external = this.isExternal();
		let extern = external ? 'external' : '';
		let seen = this.isSeen() ? 'seen' : '';

		var {icon} = state;
		if (seen && !icon) {
			icon = BLANK_IMAGE;
		}

		let extra = `${extern} ${seen}`;

		return (
			<a className={`content-link related-work-ref ${extra}`}
				href={state.href} target={external ? '_blank' : null}
				onClick={this.props.onClick}>

				{!icon ? null :
					<div className="icon" style={{backgroundImage: `url(${icon})`}}>
						{external && <div/>}
					</div>
				}

				<h5 dangerouslySetInnerHTML={{__html: item.title}}/>
				<hr className="break hide-for-medium-up"/>
				<div className="label" dangerouslySetInnerHTML={{__html: item.creator}}/>
				<div className="description" dangerouslySetInnerHTML={{__html: item.desc}}/>
			</a>
		);
	}
});
