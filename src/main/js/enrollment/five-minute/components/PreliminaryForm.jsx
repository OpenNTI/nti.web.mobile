/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var FieldRender = require('common/components/forms/mixins/RenderFieldConfigMixin');
var FormPanel = require('common/components/forms/FormPanel');
var _formConfig = require('../configs/PreliminaryForm');
var t = require('common/locale').scoped('ENROLLMENT.forms.fiveminute');

var PreliminaryForm = React.createClass({

	mixins: [FieldRender],

	getInitialState: function() {
		return {
			fieldValues: {}
		}
	},

	_handleSubmit: function() {

	},

	render: function() {

		var form = this.renderFormConfig(_formConfig, this.state.fieldValues, t);
		var title = t('admissionTitle');

		return (
			<FormPanel title={title} onSubmit={this._handleSubmit}>
				{form}
			</FormPanel>
		);
	}

});

module.exports = PreliminaryForm;
