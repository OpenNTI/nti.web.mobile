import PropTypes from 'prop-types';
import { Link } from 'react-router-component';

import { scoped } from '@nti/lib-locale';

const t = scoped('library.sections', {
	admin: 'Administered Courses',
	courses: 'Courses',
	communities: 'Communities',
	books: 'Books',
});

SectionTitle.propTypes = {
	section: PropTypes.string.isRequired,
	href: PropTypes.string,
};

export default function SectionTitle(props) {
	const { section, href } = props;
	let Component = href ? Link : 'h1';

	let p = {
		className: 'library-section-title-old',
		children: t(section),
		href,
	};

	return <Component {...p} />;
}
