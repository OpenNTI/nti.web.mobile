import PropTypes from 'prop-types';

import { DateTime } from '@nti/web-commons';
import Avatar from 'internal/common/components/Avatar';
import DisplayName from 'internal/common/components/DisplayName';

export default function Joined({ entity }) {
	return (
		<div className="joined avatar-heading">
			<Avatar entity={entity} />
			<div className="wrap">
				<h1>
					<DisplayName entity={entity} usePronoun /> joined
					NextThought!
				</h1>
				<div className="meta">
					<DateTime date={entity.getCreatedTime()} />
				</div>
			</div>
		</div>
	);
}

Joined.propTypes = {
	entity: PropTypes.object.isRequired,
};
