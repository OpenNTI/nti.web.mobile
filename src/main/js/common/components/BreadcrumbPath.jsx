import React from 'react';
import cx from 'classnames';

import ObjectLink from '../mixins/ObjectLink';

import Loading from './TinyLoader';

function getBreadcrumb (item) {
	return (item || {}).getContextPath
		? item.getContextPath()
		: Promise.reject('item doesn\'t have a getContextPath method.');
}


export default React.createClass({
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
		breadcrumb: React.PropTypes.array
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
		const {item, breadcrumb} = props;

		if (breadcrumb) {
			return this.setState({breadcrumb});
		}

		getBreadcrumb(item)

			.catch(error => {

				if (error && error.statusCode === 403 && error.Items) {
					return error.Items;
				}

				return Promise.reject(error);
			})

			.then(data =>
				this.setState({
					breadcrumb: data.length > 0
						? data[0]
						: { isError: true, reason: 'breadcrumb has zero length'}}))

			.catch(reason =>
				this.setState({
					breadcrumb: { reason, isError: true } }));
	},


	fallbackText (/*item*/) {
		return '';
	},


	crumbText (breadcrumb) {
		const prop = 'getPresentationProperties';
		const last = breadcrumb.length - 1;
		const nextToLast = breadcrumb.length - 2;
		function getTitle (x) {
			x = ((x || {})[prop] ? x[prop]() : x) || {title: typeof x === 'string' ? x : void x};
			return x.title || x.Title || x.displayName;
		}

		return breadcrumb
			.map( (current, index) => {
				let title = getTitle(current);
				return !title ? null : (
					<li key={index} className={cx('crumb', {'next-to-last': index === nextToLast, 'last': index === last})}>{title}</li>
				);
			})

			.filter(x => x); // filter out nulls
	},


	render () {
		const {state: {breadcrumb}, props: {item}} = this;
		const href = this.objectLink(item);

		if (!breadcrumb) {
			return (
				<Loading/>
			);
		}

		return (
			<div>
				<a href={href} className="breadcrumb">
					<ul className="breadcrumb-list">
						{breadcrumb.isError ? (

							<li>{this.fallbackText(item)}</li>

						) : (

							this.crumbText(breadcrumb)

						)}
					</ul>
				</a>
			</div>
		);
	}
});
