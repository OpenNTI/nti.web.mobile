import React from 'react';
import AvatarProfileLink from './AvatarProfileLink';
import {classesFor} from '../mixins/HasMembers';

AvatarGrid.propTypes = {
	entities: React.PropTypes.shape({
		map: React.PropTypes.func }).isRequired,
	creator: React.PropTypes.object,
	hideFollow: React.PropTypes.bool
};


export default function AvatarGrid ({entities, creator, hideFollow = false}) {
	return (
		<ul className="avatar-grid">
			{(entities || []).map((e, i) => {
				let css = creator ? classesFor(creator, e) : null;
				return (
					<li key={'avatar' + i} className={css}>
						<AvatarProfileLink entity={e} hideFollow={hideFollow}/>
					</li>
				);
			})}
		</ul>
	);
}
