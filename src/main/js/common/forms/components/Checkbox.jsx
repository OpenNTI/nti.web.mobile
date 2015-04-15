import React from 'react';

export default React.createClass({

	displayName: 'Checkbox',

	propTypes: {
		field: React.PropTypes.object.isRequired
	},

	render: function() {
		let config = this.props.field || {};
		return (
			<label>
				<input {...this.props}/>
				{config.htmlLabel ?
					<span className='htmlLabel' dangerouslySetInnerHTML={{__html: config.label || ''}} />
					:
					<span>{config.label}</span>
				}
			</label>
		);
	}

});
