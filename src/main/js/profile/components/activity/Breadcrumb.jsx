import React from 'react';

import Loading from 'common/components/TinyLoader';

// import {scoped} from 'common/locale';

import ObjectLink from './ObjectLink';

// let t = scoped('PROFILE.ACTIVITY.TITLES');


function getBreadcrumb (item) {
	return (item || {}).getContextPath
		? item.getContextPath()
		: Promise.reject('item doesn\'t have a getContextPath method.');
}


export default React.createClass({
	displayName: 'Breadcrumb',

	propTypes: {
		item: React.PropTypes.any.isRequired
	},

	mixins: [ObjectLink],

	getInitialState () {
		return {
			breadcrumb: null
		};
	},


	componentDidMount () {
		this.loadBreadcrumb(this.props.item);
	},

	componentWillReceiveProps (nextProps) {
		if (this.props.item !== nextProps.item) {
			this.loadBreadcrumb(nextProps.item);
		}
	},


	loadBreadcrumb (item) {
		getBreadcrumb(item)

			.catch(error => {

				if (error && error.statusCode === 403 && error.Items) {
					return error.Items;
				}

				return Promise.reject(error);
			})

			.then(breadcrumb =>
				this.setState({
					breadcrumb: breadcrumb.length > 0
						? breadcrumb[0]
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
		function getTitle (x) {
			x = ((x || {})[prop] ? x[prop]() : x) || {};
			return x.title || x.Title || x.displayName;
		}

		return breadcrumb
			.map( (current, index) => {
				let title = getTitle(current);
				return title ? <li key={index} className="crumb">{title}</li> : null;
			})

			.filter(x => x); // filter out nulls
	},


	render () {
		let {breadcrumb} = this.state;
		let bc = <Loading />;
		let href = this.objectLink(this.props.item);

		if (breadcrumb) {
			bc = (
				<a href={href} className="breadcrumb">
					<ul className="breadcrumb-list">
						{breadcrumb.isError ? (

							<li>{this.fallbackText(this.props.item)}</li>

						) : (

							this.crumbText(breadcrumb)

						)}
					</ul>
				</a>
			);
		}


		return (
			<div>{bc}</div>
		);
	}
});
