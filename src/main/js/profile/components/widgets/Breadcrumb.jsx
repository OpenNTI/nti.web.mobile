import React from 'react';
import {getTopicBreadcrumb} from './Api';
import Loading from 'common/components/TinyLoader';

export default React.createClass({
	displayName: 'Breadcrumb',

	propTypes: {
		item: React.PropTypes.any.isRequired
	},

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
		getTopicBreadcrumb(item)
		.then(breadcrumb => {
			this.setState({
				breadcrumb: breadcrumb
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

	render () {
		let {breadcrumb} = this.state;
		let bc = <Loading />;

		if (breadcrumb) {
			bc = <div className="breadcrumb">{breadcrumb.isError ? null : 'YAY' }</div>;
		}
		return (
			<div>{bc}</div>
		);
	}
});
