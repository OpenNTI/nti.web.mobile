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
import cx from 'classnames';

import {toAnalyticsPath} from 'analytics/utils';

import ContextAccessor from '../mixins/ContextAccessor';
import NavigatableMixin from '../mixins/NavigatableMixin';

import {scoped} from '../locale';

import {BLANK_IMAGE} from '../constants/DataURIs';

import ExternalResourceEvent from 'nti-lib-interfaces/lib/models/analytics/ExternalResourceEvent';
import {isNTIID, encodeForURI} from 'nti-lib-ntiids';
import {Progress} from 'nti-lib-interfaces';
import Logger from 'nti-util-logger';

import {emitEventStarted} from 'analytics/Actions';

const logger = Logger.get('common:components:card');

const t = scoped('UNITS');

const Seen = Symbol('Seen');

function isExternal (item) {
	return /external/i.test(item.type) || !isNTIID(item.href);
}

function canSetState (cmp) {
	let can = false;

	try { can = !cmp.shouldHaveDOM || !!cmp.refs.anchor; }
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
			resolveUrlHook: x => x
		};
	},


	isExternal (props = this.props) {
		const {item, internalOverride} = props || {};
		return isExternal(item) && !internalOverride;
	},


	componentDidMount () {
		this.shouldHaveDOM = true;
		this.resolveIcon(this.props);
		this.resolveHref(this.props);
	},


	componentWillReceiveProps (props) {
		const {item} = this.props;
		if(item !== props.item) {
			this.replaceState({});
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
		const {contentPackage, item} = props;
		const {href} = item;

		const setState = (...args) => {
			try {
				if (canSetState(this)) {
					this.setState(...args);
				}
			}
			catch (e) { logger.warn(e.message || e); }
		};

		if (isNTIID(href)) {
			setState({href: this.getInternalHref(href, props.slug)});
			return;
		}


		const u = href && Url.parse(href);

		if (u && (u.host || (u.path && u.path[0] === '/'))) {
			setState({href: props.resolveUrlHook(href)});
		}
		else if (contentPackage) {
			setState({href: null }, ()=> href &&
				contentPackage.resolveContentURL(href)
					.then(url=> props.resolveUrlHook(url))
					.then(url=> { setState({ href: url }); }));
		}
	},


	resolveIcon (props) {
		const {contentPackage, item = {}} = props;

		new Promise((done, bail) => {
			const {icon = ''} = item;
			const u = Url.parse(icon);
			if (u && (u.host || u.path[0] === '/')) {
				done(icon);
			}
			bail();
		})
			.catch(()=> item.icon ? contentPackage.resolveContentURL(item.icon) : Promise.reject())
			.catch(()=> this.resolveIconFallback(item))
			.catch(()=> null)
			.then(icon => {
				try {
					if (canSetState(this)) {
						this.setState({iconResolved: true, icon});
					}
				}
				catch (e) { logger.warn(e.message || e); }
			});
	},


	resolveIconFallback (item) {
		const ext = item.getFileExtentionFor();
		const iconCls = cx('fallback', ext, {unknown: ext === 'bin'});
		const iconLabel = ext && !/^(www|bin)$/i.test(ext) ? ext : null;

		this.setState({iconCls, iconLabel});
		return BLANK_IMAGE;
	},


	isSeen () {
		const {item} = this.props;
		const progress = item[Progress];
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

		const {contentPackage, item, onClick} = this.props;
		const resourceId = item.NTIID || item.ntiid; //Cards built from DOM have lowercase.
		const contentId = contentPackage.getID();//this can be a CourseInstance, ContentBundle, or ContentPackage

		if (onClick) {
			onClick(e);
		}

		if (!this.isSeen()) {
			item[Seen] = true;
		}

		if (this.isExternal()) {
			this.resolveContext().then(context => {
				const viewEvent = new ExternalResourceEvent(
					resourceId,
					contentId,
					toAnalyticsPath(context, resourceId)
				);

				emitEventStarted(viewEvent);
			});
		}
	},


	onClickDiscussion (e) {
		const {refs: {anchor}, props: {disableLink, item, externalSlug = 'external'}} = this;

		if (disableLink) { return; }
		const subRef = e.target.getAttribute('href');

		this.ignoreClick = true;

		if (this.isExternal()) {
			anchor.setAttribute('target', '');
			anchor.setAttribute('href', this.getInternalHref(item.NTIID, externalSlug));
		}

		const href = path.join(anchor.getAttribute('href'), subRef);

		anchor.setAttribute('href', href);
	},


	render () {
		const {state: {href, icon, iconCls, iconLabel}, props: {item, contentPackage, commentCount, disableLink}} = this;

		const external = this.isExternal();
		const seen = this.isSeen();

		const classes = { external, seen };

		const iconSrc = (seen && !icon) ? BLANK_IMAGE : icon;
		const ref = disableLink || !contentPackage ? null : href;

		const {label, title, desc, description, byline, creator} = item;

		const by = 'byline' in item ? byline : creator;

		return (
			<a className={cx('content-link', 'related-work-ref', classes)}
				href={ref} target={external ? '_blank' : null}
				onClick={this.onClick} ref="anchor">

				{!iconSrc ? null :
					<div className={cx('icon', iconCls)} style={{backgroundImage: `url(${iconSrc})`}}>
						{external && <div className="external"/>}
						{iconLabel && (<label>{iconLabel}</label>)}
					</div>
				}

				<h5 dangerouslySetInnerHTML={{__html: label || title}}/>
				<hr className="break hide-for-medium-up"/>
				{by && by.trim().length > 0 && <div className="label" dangerouslySetInnerHTML={{__html: 'By ' + by}/*TODO: localize*/}/>}
				<div className="description" dangerouslySetInnerHTML={{__html: description || desc}}/>
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
