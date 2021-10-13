
import Activity from '../Activity';
import ProfileBodyContainer from '../ProfileBodyContainer';

import GroupMembers from './Members';

export default function GroupActivity(props) {
	return (
		<ProfileBodyContainer className="activity">
			<Activity {...props} />
			<GroupMembers {...props} />
		</ProfileBodyContainer>
	);
}
