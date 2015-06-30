import React from 'react';
import {getTopicBreadcrumb} from '../../Api';
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

	componentWillReceiveProps: function(nextProps) {
		this.loadBreadcrumb(nextProps.item);
	},

	loadBreadcrumb (item) {
		getTopicBreadcrumb(item.getID())
		.then(breadcrumb => {
			this.setState({
				breadcrumb: breadcrumb[0]
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
		return breadcrumb.reduce( (previous, current) => {
			let p = (current || {}).getPresentationProperties ? current.getPresentationProperties() : current;
			let title = (p || {}).title;
			// if there's no previous value (first iteration) just return the title so we don't have a leading slash.
			return previous ? [previous, title].join(' / ') : title;
		}, null);
	},

	render () {
		let {breadcrumb} = this.state;
		let bc = <Loading />;
		let href = this.objectLink(this.props.item);

		if (breadcrumb) {
			bc = <a href={href} className="breadcrumb">{breadcrumb.isError ? this.fallbackText(this.props.item) : this.crumbText(breadcrumb) }</a>;
		}
		return (
			<div>{bc}</div>
		);
	}
});
