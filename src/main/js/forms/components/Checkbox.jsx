import React from 'react';
import {rawContent} from 'nti-commons';

export default function Checkbox (props) {
	let config = props.field || {};
	return (
		<label>
			<input {...props}/>
			{config.htmlLabel ?
				<span className="htmlLabel" {...rawContent(config.label || '')} />
				:
				<span>{config.label}</span>
			}
		</label>
	);
}

Checkbox.propTypes = {
	field: React.PropTypes.object.isRequired
};
