import React from 'react';
import hasItems from 'profile/components/activity/HasItems';
import Card from 'profile/components/Card';
import DateTime from 'common/components/DateTime';

const startDateFormat = 'MMMM D';

export default React.createClass({
	displayName: 'Course:ActivityBucket',
	mixins: [hasItems],
	propTypes: {
		bucket: React.PropTypes.object.isRequired
	},

	render () {

		let {bucket} = this.props;
		let endDateFormat = bucket.start.getMonth() === bucket.end.getMonth() ? 'D' : startDateFormat;
		return (
			<Card>
				<div className="header"><DateTime date={bucket.start} format={startDateFormat} /> — <DateTime date={bucket.end} format={endDateFormat} /></div>
				{this.renderItems(bucket)}
			</Card>
		);
	}
});
