/** @jsx React.DOM */

'use strict';

var React = require('react/addons');
var FieldRender = require('common/forms/mixins/RenderFormConfigMixin');
var RelatedFormPanel = require('common/forms/components/RelatedFormPanel');
var RelatedFormStore = require('common/forms/RelatedFormStore');
var _formConfig = require('../configs/FiveMinuteEnrollmentForm');
var t = require('common/locale').scoped('ENROLLMENT.forms.fiveminute');
var ButtonFullWidth = require('common/forms/components/ButtonFullWidth');
var Actions = require('../Actions');

var _rootFormRef = 'rootForm';

var FiveMinuteEnrollmentForm = React.createClass({

	mixins: [FieldRender],

	getInitialState: function() {
		return {
			fieldValues: {}
		};
	},

	_handleSubmit: function() {
		Actions.preflight();
		console.debug(RelatedFormStore.getValues(this.props.storeContextId));
	},

	render: function() {

		var form = this.renderFormConfig(_formConfig, this.state.fieldValues, t);
		var title = t('admissionTitle');

		return (
			<div className="fiveminuteform">
				<RelatedFormPanel
					ref={_rootFormRef}
					storeContextId={this.props.storeContextId}
					title={title}
					formConfig={_formConfig}
					translator={t}
				>
					{form}
				</RelatedFormPanel>
				<div className="row">
					<div className="medium-6 medium-centered columns">
						<ButtonFullWidth onClick={this._handleSubmit}>{t('submit')}</ButtonFullWidth>
					</div>
				</div>
			</div>
		);
	}

});

module.exports = FiveMinuteEnrollmentForm;
