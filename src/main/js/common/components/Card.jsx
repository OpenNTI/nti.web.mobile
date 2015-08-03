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
import Url from 'url';
import emptyFunction from 'react/lib/emptyFunction';

import {toAnalyticsPath} from 'analytics/utils';

import ContextAccessor from '../mixins/ContextAccessor';
import NavigatableMixin from '../mixins/NavigatableMixin';

import {scoped} from '../locale';

import {BLANK_IMAGE} from '../constants/DataURIs';

import ExternalResourceEvent from 'nti.lib.interfaces/models/analytics/ExternalResourceEvent';
import {isNTIID, encodeForURI} from 'nti.lib.interfaces/utils/ntiids';
import {CommonSymbols} from 'nti.lib.interfaces';

import {emitEventStarted} from 'analytics/Actions';

const t = scoped('UNITS');

const Seen = Symbol('Seen');
let {Progress} = CommonSymbols;

function isExternal (item) {
	return /external/i.test(item.type) || !isNTIID(item.href);
}

function canSetState (cmp) {
	let can = false;

	try { can = !cmp.shouldHaveDOM || !!React.findDOMNode(cmp); }
	catch (e) {} //eslint-disable-line

	return can;
}

export default React.createClass({
	mixins: [ContextAccessor, NavigatableMixin],
	displayName: 'RelatedWorkRef',

	statics: {
		isExternal
	},


	propTypes: {
		/**
		 * Make the widget render without the link behavior.
		 *
		 * @type {boolean}
		 */
		disableLink: React.PropTypes.bool,

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
		contentPackage: React.PropTypes.object,

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


		commentCount: React.PropTypes.oneOfType([
			React.PropTypes.number,
			React.PropTypes.string
		])
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


	isExternal (props = this.props) {
		let {item, internalOverride} = props || {};
		return isExternal(item) && !internalOverride;
	},


	componentDidMount () {
		this.shouldHaveDOM = true;
		this.resolveIcon(this.props);
		this.resolveHref(this.props);
	},


	componentWillReceiveProps (props) {
		let {item} = this.props;
		if(item !== props.item) {
			this.resolveIcon(props);
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

		let setState = (...args) => {
			try {
				if (canSetState(this)) {
					this.setState(...args);
				}
			}
			catch (e) { console.warn(e.message || e); }
		};

		if (isNTIID(href)) {
			setState({href: this.getInternalHref(href, props.slug)});
			return;
		}


		let u = Url.parse(href);

		if (u && (u.host || (u.path && u.path[0] === '/'))) {
			setState({href: props.resolveUrlHook(href)});
		}
		else if (contentPackage) {
			setState({href: null }, ()=>
				contentPackage.resolveContentURL(href)
					.then(url=> props.resolveUrlHook(url))
					.then(url=> { setState({ href: url }); }));
		}
	},


	resolveIcon (props) {
		let {contentPackage, item = {}} = props;

		new Promise((done, bail) => {
			let {icon = ''} = item;
			let u = Url.parse(icon);
			if (u && (u.host || u.path[0] === '/')) {
				done(icon);
			}
			bail();
		})
			.catch(()=> contentPackage.resolveContentURL(props.item.icon))
			.catch(()=> null)
			.then(icon => {
				try {
					if (canSetState(this)) {
						this.setState({iconResolved: true, icon});
					}
				}
				catch (e) { console.warn(e.message || e); }
			});
	},


	isSeen () {
		let {item} = this.props;
		let progress = item[Progress];
		return item[Seen] || (progress && progress.hasProgress());
	},


	onClick (e) {
		if (this.props.disableLink) {
			e.preventDefault();
			e.stopPropagation();
			return;
		}

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
		if (this.props.disableLink) { return; }
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
		let {item, commentCount, disableLink} = this.props;
		let external = this.isExternal();
		let extern = external ? 'external' : '';
		let seen = this.isSeen() ? 'seen' : '';
		let {href, icon} = state;

		if (seen && !icon) {
			icon = BLANK_IMAGE;
		}

		let extra = `${extern} ${seen}`;

		if (disableLink) {
			href = null;
		}

		let {label, title, desc, description, creator} = item;
		label = label || title;
		desc = description || desc;

		return (
			<a className={`content-link related-work-ref ${extra}`}
				href={href} target={external ? '_blank' : null}
				onClick={this.onClick}>

				{!icon ? null :
					<div className="icon" style={{backgroundImage: `url(${icon})`}}>
						{external && <div/>}
					</div>
				}

				<h5 dangerouslySetInnerHTML={{__html: label}}/>
				<hr className="break hide-for-medium-up"/>
				<div className="label" dangerouslySetInnerHTML={creator ? {__html: 'By ' + creator} : null /*TODO: localize*/}/>
				<div className="description" dangerouslySetInnerHTML={{__html: desc}}/>
				<div className="comment-count" href="/discussions/" onClick={this.onClickDiscussion}>
					{commentCount == null
						? null
						: typeof commentCount === 'number'
							? t('comments', {count: commentCount})
							: commentCount
					}
				</div>
			</a>
		);
	}
});
