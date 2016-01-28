import React from 'react';

export default React.createClass({
	displayName: 'CourseOverviewUnknown',

	propTypes: {
		item: React.PropTypes.shape({
			MimeType: React.PropTypes.string
		}).isRequired
	},

	render () {
		let {item} = this.props;

		let type = (item.MimeType || 'Unknown')
			.replace('application/vnd.nextthought.', '');

		return (<div>Unknown Type: {type}</div>);
	}
});
