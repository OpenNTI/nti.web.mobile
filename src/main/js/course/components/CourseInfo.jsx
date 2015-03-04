import React from 'react';
import Detail from 'catalog/components/Detail';
import EnrollButton from 'catalog/components/EnrollButton'; // drop course button

export default React.createClass({
	displayName: 'CourseInfo',

	render () {
		let {course} = this.props;
		let entry = course && course.CatalogEntry;

		return (
			<div>
				<Detail {...this.props} entry={entry}/>
				<EnrollButton catalogEntry={entry} dropOnly={true}/>
			</div>
		);
	}
});
