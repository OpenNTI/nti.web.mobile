import React from 'react';

import Activity from '../Activity';
import ProfileBodyContainer from '../ProfileBodyContainer';

import GroupMembers from './Members';


export default React.createClass({
	displayName: 'Group:Activity',

	render () {
		let {props} = this;
		return (
			<ProfileBodyContainer className="activity">
				<Activity {...props}/>
				<GroupMembers {...props} />
			</ProfileBodyContainer>
		);
	}
});
