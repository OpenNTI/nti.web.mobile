import React from 'react';

import ItemsMixin from 'activity/RenderItemsMixin';

import DateTime from 'common/components/DateTime';

import Card from 'profile/components/Card';


const startDateFormat = 'MMMM D';

export default React.createClass({
	displayName: 'Course:ActivityBucket',
	mixins: [ItemsMixin],
	propTypes: {
		bucket: React.PropTypes.object.isRequired
	},

	render () {

		let {bucket} = this.props;
		let endDateFormat = bucket.start.getMonth() === bucket.end.getMonth() ? 'D' : startDateFormat;
		return (
			<Card>
				<div className="header"><DateTime date={bucket.start} format={startDateFormat} /> - <DateTime date={bucket.end} format={endDateFormat} /></div>
				<div className="bucketed-items">{this.renderItems(bucket, {className: 'bucketed-item'})}</div>
			</Card>
		);
	}
});
