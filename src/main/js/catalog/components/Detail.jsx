import './Detail.scss';
import PropTypes from 'prop-types';

import { Info } from '@nti/web-course';

Detail.propTypes = {
	entry: PropTypes.object,
};

export default function Detail({ entry }) {
	return (
		<div className="course-detail-view">
			<Info.Inline catalogEntry={entry} />
			<div className="footer" />
		</div>
	);
}
