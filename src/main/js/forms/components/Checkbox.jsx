import PropTypes from 'prop-types';

import { rawContent } from '@nti/lib-commons';

export default function Checkbox(props) {
	let config = props.field || {};
	return (
		<label>
			<input {...props} />
			{config.htmlLabel ? (
				<span
					className="html-label"
					{...rawContent(config.label || '')}
				/>
			) : (
				<span>{config.label}</span>
			)}
		</label>
	);
}

Checkbox.propTypes = {
	field: PropTypes.object.isRequired,
};
