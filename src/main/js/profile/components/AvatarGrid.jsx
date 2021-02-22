import React from 'react';
import PropTypes from 'prop-types';

import { classesFor } from '../mixins/HasMembers';

import AvatarProfileLink from './AvatarProfileLink';

AvatarGrid.propTypes = {
	entities: PropTypes.shape({
		map: PropTypes.func,
	}).isRequired,
	creator: PropTypes.object,
	hideFollow: PropTypes.bool,
};

export default function AvatarGrid({ entities, creator, hideFollow = false }) {
	return (
		<ul className="avatar-grid">
			{(entities || []).map((e, i) => {
				let css = creator ? classesFor(creator, e) : null;
				return (
					<li key={'avatar' + i} className={css}>
						<AvatarProfileLink entity={e} hideFollow={hideFollow} />
					</li>
				);
			})}
		</ul>
	);
}
