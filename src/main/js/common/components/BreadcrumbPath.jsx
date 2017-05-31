import React from 'react';
import createReactClass from 'create-react-class';
import cx from 'classnames';

import Logger from 'nti-util-logger';

import ContentAcquirePrompt from 'catalog/components/ContentAcquirePrompt';

import ObjectLink from '../mixins/ObjectLink';

const logger = Logger.get('common:components:BreadcrumbPath');

function getBreadcrumb (item) {
	return (item || {}).getContextPath
		? item.getContextPath()
		: Promise.reject('item doesn\'t have a getContextPath method.');
}


export default createReactClass({
	displayName: 'Breadcrumb',
	mixins: [ObjectLink],

	propTypes: {
		item: React.PropTypes.any.isRequired,

		/**
		 * Force the breadcrumb to be whatever you want with this
		 * prop preventing it from loading it from the LibraryPath call.
		 *
		 * You can pass an array of strings (display) or
		 * objects with `title`, `Title` or `displayName` properties.
		 *
		 * @type {array}
		 */
		breadcrumb: React.PropTypes.array,


		/**
		 * Alter the breadcrumb prop to prefix and potentilly
		 * replace N parts of the LibraryPath call.
		 *
		 * If specified, and not negative, the breadcrumb will be prefixed
		 * onto the LibraryPath using:
		 *
		 * 		[...breadcrumb, ...slice(splicePaths)]
		 *
		 * @type {number}
		 */
		splicePaths: React.PropTypes.number,


		/**
		 * If specified, show the content-aquire-prompt on 403 instead of showing just the course name.
		 *
		 * @type {boolean}
		 */
		showPrompt: React.PropTypes.bool
	},


	getInitialState () {
		return {
			breadcrumb: null
		};
	},


	componentDidMount () {
		this.loadBreadcrumb();
	},


	componentWillReceiveProps (nextProps) {
		if (this.props.item !== nextProps.item) {
			this.loadBreadcrumb(nextProps);
		}
	},


	loadBreadcrumb (props = this.props) {
		const {item, breadcrumb, splicePaths, showPrompt} = props;

		const hasSplice = splicePaths != null && breadcrumb != null
				&& isFinite(splicePaths)
				&& splicePaths >= 0;

		const splice = n => breadcrumb.concat(n.slice(splicePaths));

		if (breadcrumb && !hasSplice) {
			return this.setState({breadcrumb});
		}

		getBreadcrumb(item)

			.catch(error => {

				if (error && error.statusCode === 403) {
					if (!showPrompt && error.Items) {
						return [error.Items];
					}
				}

				return Promise.reject(error);
			})

			.then(data =>
				this.setState({
					breadcrumb: data.length > 0
						? (hasSplice ? splice(data[0]) : data[0])
						: { isError: true, reason: 'breadcrumb has zero length'}}))

			.catch(reason =>
				this.setState({
					breadcrumb: { reason, isError: true } }));
	},


	fallbackText (item, error) {
		logger.error('%o Error: %o', item, error);
		return '';
	},


	crumbText (breadcrumb) {
		const prop = 'getPresentationProperties';
		const last = breadcrumb.length - 1;
		const nextToLast = breadcrumb.length - 2;
		function getTitle (x) {
			const t = typeof x === 'string';
			const fallback = {title: t ? x : void x};

			x = (
				(x || {})[prop]
					? x[prop]()
					: t
						? fallback
						: x
				) || fallback;

			return x.title || x.Title || x.displayName;
		}

		return breadcrumb
			.map( (current, index) => {
				const title = getTitle(current);
				const css = cx('crumb', {'next-to-last': index === nextToLast, 'last': index === last});
				return !title ? null : (
					<li key={index} className={css}>
						<span>{title}</span>
					</li>
				);
			})

			.filter(x => x); // filter out nulls
	},


	render () {
		const {state: {breadcrumb}, props: {item, showPrompt}} = this;
		const href = breadcrumb && !breadcrumb.isError ? this.objectLink(item) : null;

		if (!breadcrumb) {
			return this.renderPlaceholder();
		}

		const {reason = {}, isError} = breadcrumb;

		if (showPrompt && isError && reason.statusCode === 403) {
			return (
				<ContentAcquirePrompt relatedItem={item} data={reason}/>
			);
		}

		return (
			<div>
				<a href={href} className="breadcrumb">
					<ul className="breadcrumb-list">
						{breadcrumb.isError ? (

							<li>{this.fallbackText(item, breadcrumb)}</li>

						) : (

							this.crumbText(breadcrumb)

						)}
					</ul>
				</a>
			</div>
		);
	},


	renderPlaceholder () {
		const {props: {item}} = this;
		const href = this.objectLink(item);
		const num = () => Math.round(Math.random() * 100);
		const width = (x) => ({width: (Math.max(num() % x, 15)) + '%'});
		const peices = Array.from({length: Math.max(num() % 5, 1)});

		const segment = (_, index, a) => (
			<li key={index} style={width(35)} className={cx('crumb', { 'next-to-last': index === (a.length - 1) })}>
				<span/>
			</li>
		);

		return (
			<div>
				<a href={href} className="breadcrumb placeholder">
					<ul className="breadcrumb-list">
						{peices.map(segment)}
						<li className="crumb last"><span style={width(55)}/></li>
					</ul>
				</a>
			</div>
		);
	}
});
