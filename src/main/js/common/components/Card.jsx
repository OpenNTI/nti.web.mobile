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

import {scoped} from '../locale';

import {BLANK_IMAGE} from '../constants/DataURIs';

import ExternalResourceEvent from 'nti.lib.interfaces/models/analytics/ExternalResourceEvent';
import {isNTIID, encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

import {emitEventStarted} from 'analytics/Actions';

const t = scoped('UNITS');

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
		 * Do not pass a slug to have the card render as a NTIID link.
		 *
		 * @type {string}
		 */
		slug: React.PropTypes.string,

		/**
		 * alternate slug for external links. See onClickDiscussion.
		 *
		 * @type {string}
		 */
		externalSlug: React.PropTypes.string,

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


		icon: React.PropTypes.string,


		commentCount: React.PropTypes.number
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


	getInternalHref (ntiid, slug = null) {
		return slug
			? this.makeHref(path.join(slug, encodeForURI(ntiid)) + '/', true)
			: ntiid; //No slug, assume we're in a context that can understand raw NTIID links
	},


	resolveHref (props) {
		let {contentPackage, item} = props;
		let {href} = item;

		if (isNTIID(href)) {
			this.setState({href: this.getInternalHref(href, props.slug)});
			return;
		}


		this.setState({href: null });

		if (contentPackage) {
			contentPackage.resolveContentURL(href)
				.then(url=> props.resolveUrlHook(url))
				.then(url=> {
					this.setState({ href: url });
				});
		}
	},


	resolveIcon (props) {
		let {contentPackage, item} = props;
		this.setState({	icon: null	});
		if (!contentPackage || !item || !item.icon) {
			return;
		}

		contentPackage.resolveContentURL(props.item.icon)
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
		if (this.ignoreClick) {
			delete this.ignoreClick;
			return;
		}

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


	onClickDiscussion (e) {
		let anchor = React.findDOMNode(this);
		let {item, externalSlug = 'external'} = this.props;
		let subRef = e.target.getAttribute('href');

		this.ignoreClick = true;

		if (this.isExternal()) {
			anchor.setAttribute('target', '');
			anchor.setAttribute('href', this.getInternalHref(item.NTIID, externalSlug));
		}

		let href = path.join(anchor.getAttribute('href'), subRef);

		anchor.setAttribute('href', href);
	},


	render () {
		let {state} = this;
		let {item, commentCount} = this.props;
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

				<h5 dangerouslySetInnerHTML={{__html: item.title}}/>
				<hr className="break hide-for-medium-up"/>
				<div className="label" dangerouslySetInnerHTML={{__html: 'By ' + item.creator}/*TODO: localize*/}/>
				<div className="description" dangerouslySetInnerHTML={{__html: item.desc}}/>
				<div className="comment-count" href="/discussions" onClick={this.onClickDiscussion}>{commentCount ? t('comments', {count: commentCount}) : null}</div>
			</a>
		);
	}
});
