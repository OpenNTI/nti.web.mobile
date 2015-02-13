import React from 'react/addons';
import Detail from 'library/catalog/components/Detail';
import EnrollButton from 'library/catalog/components/EnrollButton'; // drop course button

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
