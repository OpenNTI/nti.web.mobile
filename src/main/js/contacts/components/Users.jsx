import React from 'react/addons';
import mixin from '../mixins/Mixin';
import {USERS} from '../Constants';

export default React.createClass({
	displayName: 'Contacts:Users',
	mixins: [mixin],
	storeType: USERS,

	getDefaultProps () {
		return {
			listClassName: 'users'
		};
	},

	renderListItem (item) {
		let e = item;
		<li key={'avatar' + e.Username}>
			<ProfileLink entity={e}>
				<Avatar entity={e} />
				<div className="body">
					{ typeof e === 'string' ? <DisplayName entity={e} /> : <DisplayName entity={e} />}
					<span className="location" dangerouslySetInnerHTML={{__html: e.location}}/>
				</div>
			</ProfileLink>
		</li>
	}

});
