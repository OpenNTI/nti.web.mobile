import React from 'react';
import hasItems from 'profile/components/activity/HasItems';
import Card from 'profile/components/Card';
import DateTime from 'common/components/DateTime';

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
				<div className="header"><DateTime date={bucket.start}/> - <DateTime date={bucket.end} /></div>
				{this.renderItems(bucket)}
			</Card>
		);
	}
});
