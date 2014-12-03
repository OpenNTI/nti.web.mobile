/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var FormPanel = require('common/components/forms/FormPanel');
var RenderField = require('common/components/forms/mixins/RenderFormConfigMixin');
var Actions = require('../Actions');
var t = require('common/locale').translate;

var ContactForm = React.createClass({

	mixins: [RenderField],

	propTypes: {
		onSubmit: React.PropTypes.func,
		fieldConfig: React.PropTypes.array.isRequired
	},

	getInitialState: function() {
		return {
			fieldValues: {}
		};
	},

	_handleSubmit: function(event) {
		event.preventDefault();
		Actions.sendMessage(this.state.fieldValues);
	},

	render: function() {

		var fields = this.renderFormConfig(this.props.fieldConfig, this.state.fieldValues, t);

		return (
			<FormPanel onSubmit={this._handleSubmit}>
				{fields}
				<input type="submit"
					key="submit"
					id="contact:submit"
					className="small-12 columns tiny button radius"
					value="Send" />
			</FormPanel>
		);
	}

});

module.exports = ContactForm;
