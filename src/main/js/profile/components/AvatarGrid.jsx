import React from 'react';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

import ProfileLink from './ProfileLink';

export default React.createClass({
	displayName: 'AvatarGrid',

	propTypes: {
		entities: React.PropTypes.array.isRequired
	},


	render () {
		let {entities} = this.props;

		return (
			<ul className="avatar-grid">
				{(entities || []).map((e, i) => (
					<li key={'avatar' + i}>
						<ProfileLink entity={e}><Avatar entity={e} /></ProfileLink>
						<div className="body">
							{ typeof e === 'string' ? <DisplayName username={e} /> : <DisplayName entity={e} />}
							<span className="location">{e.location}</span>
						</div>
					</li>
				))}
			</ul>
		);
	}
});
