import React from 'react';
import hasItems from 'profile/components/activity/HasItems';
import Card from 'profile/components/Card';

export default React.createClass({
	displayName: 'Course:ActivityBucket',
	mixins: [hasItems],
	propTypes: {
		bucket: React.PropTypes.object.isRequired
	},

	render () {

		let {bucket} = this.props;
		return (
			<Card>
				{this.renderItems(bucket.Items)}
			</Card>
		);
	}
});
