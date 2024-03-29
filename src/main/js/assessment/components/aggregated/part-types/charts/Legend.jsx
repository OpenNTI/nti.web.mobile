import PropTypes from 'prop-types';

import { rawContent } from '@nti/lib-commons';

Legend.propTypes = {
	items: PropTypes.array,
	colors: PropTypes.object,
};

export default function Legend(props) {
	const { colors, items } = props;

	if (!items || !(items.length > 1)) {
		// the "!" catches the case where length is not numeric AND length is less than 2.
		return null;
	}

	return (
		<div className="legend">
			{items.map((name, i) => (
				<div key={i + name} className="legend-item">
					<span
						className="legend-swatch"
						style={{ background: colors[name] }}
					/>
					<span {...rawContent(name)} />
				</div>
			))}
		</div>
	);
}
