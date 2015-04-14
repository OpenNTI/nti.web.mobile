'use strict';

var React = require('react');

var Checkbox = React.createClass({

	propTypes: {
		field: React.PropTypes.object.isRequired
	},

	render: function() {
		var config = this.props.field || {};
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

module.exports = Checkbox;
