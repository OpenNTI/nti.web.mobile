/** @jsx React.DOM */

'use strict';

var React = require('react/addons');
var FieldRender = require('common/forms/mixins/RenderFormConfigMixin');
var RelatedFormPanel = require('common/forms/components/RelatedFormPanel');
var RelatedFormStore = require('common/forms/RelatedFormStore');
var _formConfig = require('../configs/PreliminaryForm');
var t = require('common/locale').scoped('ENROLLMENT.forms.fiveminute');

var PreliminaryForm = React.createClass({

	mixins: [FieldRender],

	getInitialState: function() {
		return {
			fieldValues: {}
		};
	},

	_handleSubmit: function() {

	},

	render: function() {

		var form = this.renderFormConfig(_formConfig, this.state.fieldValues, t);
		var title = t('admissionTitle');

		return (
			<RelatedFormPanel storeContextId={RelatedFormStore.newContext()} title={title} onSubmit={this._handleSubmit} formConfig={_formConfig} translator={t}>
				{form}
			</RelatedFormPanel>
		);
	}

});

module.exports = PreliminaryForm;
