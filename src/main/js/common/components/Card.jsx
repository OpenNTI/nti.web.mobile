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

import {toAnalyticsPath} from 'analytics/utils';

import ContextAccessor from '../mixins/ContextAccessor';
import NavigatableMixin from '../mixins/NavigatableMixin';

import {BLANK_IMAGE} from '../constants/DataURIs';

import ExternalResourceEvent from 'nti.lib.interfaces/models/analytics/ExternalResourceEvent';
import {isNTIID, encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

import {emitEventStarted} from 'analytics/Actions';

const Seen = Symbol('Seen');
const Progress = Symbol.for('Progress');

export default React.createClass({
	mixins: [ContextAccessor, NavigatableMixin],
	displayName: 'RelatedWorkRef',

	propTypes: {
		/**
		 * The slug to put between the basePath and the resource
		 * target/href/ntiid at the end of the uri.
		 *
		 * @type {string}
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
		 * @type {object}
		 */
		item: React.PropTypes.object.isRequired,

		/**
		 * Allow the parent to force this card to be an "internal" link.
		 * @type {boolean}
		 */
		internalOverride: React.PropTypes.bool,

		/**
		 * Allow the parent to have final word on the resolved url.
		 * The functoin must take one argument, and return a string.
		 * @type {function}
		 */
		resolveUrlHook: React.PropTypes.func,


		onClick: React.PropTypes.func,


		icon: React.PropTypes.string
	},


	getInitialState () {
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
		let {icon, item} = this.props;
		if (icon !== props.icon) {
			this.resolveIcon(props);
		}

		if(item !== props.item) {
			this.resolveHref(props);
		}
	},


	resolveHref (props) {
		let href = props.item.href;

		if (isNTIID(href)) {
			let link = path.join(
				props.slug || '',
				encodeForURI(href)) + '/';

			this.setState({href: this.makeHref(link, true)});
			return;
		}


		this.setState({	href: null });

		props.contentPackage.resolveContentURL(href)
			.then(url=> props.resolveUrlHook(url))
			.then(url=> {
				this.setState({ href: url });
			});
	},


	resolveIcon (props) {
		this.setState({	icon: null	});
		if (!props.item.icon) {
			return;
		}
		props.contentPackage.resolveContentURL(props.item.icon)
			.then(icon =>this.setState({iconResolved: true, icon}));
	},


	isExternal (props) {
		let p = props || this.props;
		let {item, internalOverride} = p;

		return !isNTIID(item.href) && !internalOverride;
	},


	isSeen () {
		let {item} = this.props;
		let progress = item[Progress];
		return item[Seen] || (progress && progress.hasProgress());
	},


	onClick (e) {
		let {contentPackage, item, onClick} = this.props;
		let resourceId = item.NTIID;
		let contentId = contentPackage.getID();//this can be a CourseInstance, ContentBundle, or ContentPackage

		if (onClick) {
			onClick(e);
		}

		if (!this.isSeen()) {
			item[Seen] = true;
		}

		if (this.isExternal()) {
			this.resolveContext().then(context => {
				let viewEvent = new ExternalResourceEvent(
					resourceId,
					contentId,
					toAnalyticsPath(context, resourceId)
				);

				emitEventStarted(viewEvent);
			});
		}
	},


	render () {
		let {state} = this;
		let {item} = this.props;
		let external = this.isExternal();
		let extern = external ? 'external' : '';
		let seen = this.isSeen() ? 'seen' : '';

		let {icon} = state;
		if (seen && !icon) {
			icon = BLANK_IMAGE;
		}

		let extra = `${extern} ${seen}`;

		return (
			<a className={`content-link related-work-ref ${extra}`}
				href={state.href} target={external ? '_blank' : null}
				onClick={this.onClick}>

				{!icon ? null :
					<div className="icon" style={{backgroundImage: `url(${icon})`}}>
						{external && <div/>}
					</div>
				}

				<h5 dangerouslySetInnerHTML={{__html: item.title || ''}}/>
				<hr className="break hide-for-medium-up"/>
				<div className="label" dangerouslySetInnerHTML={{__html: item.creator || ''}}/>
				<div className="description" dangerouslySetInnerHTML={{__html: item.desc || ''}}/>
			</a>
		);
	}
});
