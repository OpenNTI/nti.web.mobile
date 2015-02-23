import React from 'react';
import Detail from 'catalog/components/Detail';
import EnrollButton from 'catalog/components/EnrollButton'; // drop course button

export default React.createClass({
	displayName: 'CourseDescription',

	render () {
		return (
			<div>
				<Detail {...this.props}/>
				<EnrollButton catalogEntry={this.props.entry} dropOnly={true}/>
			</div>
		);
	}
});
