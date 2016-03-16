import React from 'react';
import {rawContent} from 'common/utils/jsx';

export default React.createClass({

	displayName: 'Checkbox',

	propTypes: {
		field: React.PropTypes.object.isRequired
	},

	render () {
		let config = this.props.field || {};
		return (
			<label>
				<input {...this.props}/>
				{config.htmlLabel ?
					<span className="htmlLabel" {...rawContent(config.label || '')} />
					:
					<span>{config.label}</span>
				}
			</label>
		);
	}

});
