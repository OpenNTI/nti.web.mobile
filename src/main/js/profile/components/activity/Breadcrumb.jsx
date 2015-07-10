import React from 'react';
import {getBreadcrumb} from '../../Api';
import ObjectLink from './ObjectLink';
import Loading from 'common/components/TinyLoader';
import {scoped} from 'common/locale';
let t = scoped('PROFILE.ACTIVITY.TITLES');

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
		this.loadBreadcrumb(nextProps.item);
	},

	loadBreadcrumb (item) {
		getBreadcrumb(item)
		.then(breadcrumb => {
			this.setState({
				breadcrumb: breadcrumb.length > 0 ? breadcrumb[0] : {
					isError: true,
					reason: 'breadcrumb has zero length'
				}
			});
		})
		.catch(reason => {
			console.error(reason);
			this.setState({
				breadcrumb: {
					isError: true,
					reason: reason
				}
			});
		});
	},

	fallbackText (item) {
		let mime = (item || {}).MimeType && item.MimeType.split('.').pop();
		let text = mime && t(mime) || 'View';
		return text;
	},

	crumbText (breadcrumb) {
		return breadcrumb.map( (current, index) => {
			let p = (current || {}).getPresentationProperties ? current.getPresentationProperties() : current;
			let title = (p || {}).title || (p || {}).Title;
			return title ? <li key={title + index} className="crumb">{title}</li> : null;
		}).filter(x => x); // filter out nulls
	},

	render () {
		let {breadcrumb} = this.state;
		let bc = <Loading />;
		let href = this.objectLink(this.props.item);

		if (breadcrumb) {
			bc = <a href={href} className="breadcrumb"><ul className="breadcrumb-list">{breadcrumb.isError ? <li>{this.fallbackText(this.props.item)}</li> : this.crumbText(breadcrumb) }</ul></a>;
		}
		return (
			<div>{bc}</div>
		);
	}
});
