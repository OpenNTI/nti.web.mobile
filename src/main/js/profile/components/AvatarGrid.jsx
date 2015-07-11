import React from 'react';
import Avatar from 'common/components/Avatar';
import DisplayName from 'common/components/DisplayName';

import ProfileLink from './ProfileLink';

export default React.createClass({
	displayName: 'AvatarGrid',

	propTypes: {
		entities: React.PropTypes.array.isRequired,
		classesFor: React.PropTypes.func
	},

	render () {
		let {entities, classesFor} = this.props;

		return (
			<ul className="avatar-grid">
				{(entities || []).map((e, i) => {
					let css = classesFor ? classesFor(e) : null;
					return (
						<li key={'avatar' + i} className={css}>
							<ProfileLink entity={e}><Avatar entity={e} /></ProfileLink>
							<div className="body">
								{ typeof e === 'string' ? <DisplayName username={e} /> : <DisplayName entity={e} />}
								<span className="location">{e.location}</span>
							</div>
						</li>
					);
				})}
			</ul>
		);
	}
});
