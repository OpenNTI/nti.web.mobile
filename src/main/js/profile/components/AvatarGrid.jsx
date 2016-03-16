import React from 'react';
import AvatarProfileLink from './AvatarProfileLink';
import {classesFor} from '../mixins/HasMembers';

export default function AvatarGrid ({entities, creator}) {
	return (
		<ul className="avatar-grid">
			{(entities || []).map((e, i) => {
				let css = creator ? classesFor(creator, e) : null;
				return (
					<li key={'avatar' + i} className={css}>
						<AvatarProfileLink entity={e} />
					</li>
				);
			})}
		</ul>
	);
}

AvatarGrid.propTypes = {
	entities: React.PropTypes.shape({
		map: React.PropTypes.func }).isRequired,
	creator: React.PropTypes.object
};
