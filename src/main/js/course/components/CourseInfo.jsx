import React from 'react';
import Detail from 'catalog/components/Detail';
import EnrollButton from 'catalog/components/EnrollButton'; // drop course button

import ContextSender from 'common/mixins/ContextSender';

export default React.createClass({
	displayName: 'CourseInfo',
	mixins: [ContextSender],

	propTypes: {
		course: React.PropTypes.object.isRequired
	},

	getContext () {
		return Promise.resolve([{}]);
	},

	render () {
		let {course} = this.props;
		let entry = course && course.CatalogEntry;

		return (
			<div className="course-info">
				<Detail {...this.props} entry={entry}/>
				<EnrollButton catalogEntry={entry} dropOnly/>
			</div>
		);
	}
});
