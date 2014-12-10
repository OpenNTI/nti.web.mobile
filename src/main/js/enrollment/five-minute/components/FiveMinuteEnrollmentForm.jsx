/** @jsx React.DOM */

'use strict';

var React = require('react/addons');
var FieldRender = require('common/forms/mixins/RenderFormConfigMixin');
var RelatedFormPanel = require('common/forms/components/RelatedFormPanel');
var RelatedFormStore = require('common/forms/RelatedFormStore');
var FormErrors = require('common/forms/components/FormErrors');
var _formConfig = require('../configs/FiveMinuteEnrollmentForm');
var t = require('common/locale').scoped('ENROLLMENT.forms.fiveminute');
var ButtonFullWidth = require('common/forms/components/ButtonFullWidth');
var Actions = require('../Actions');
var Store = require('../Store');


var _rootFormRef = 'rootForm';

var FiveMinuteEnrollmentForm = React.createClass({

	mixins: [FieldRender],

	getInitialState: function() {
		return {
			fieldValues: {}
		};
	},
	componentDidMount: function() {
		Store.addChangeListener(this._storeChange);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChange);
	},

	_storeChange: function(event) {
		console.group();
		console.debug('store change event');
		console.debug(event);
		console.groupEnd();
	},

	_handleSubmit: function() {
		var fields = RelatedFormStore.getValues(this.props.storeContextId);
		Actions.preflight(fields, this.props.storeContextId);
	},

	render: function() {

		var form = this.renderFormConfig(_formConfig, this.state.fieldValues, t);
		var title = t('admissionTitle');
		var errors = RelatedFormStore.getErrors(this.props.storeContextId);

		return (
			<div className="fiveminuteform">
				<div className="row">
					<div className="medium-6 medium-centered columns">
						<h2>{title}</h2>
						<p>{t('admissionDescription')}</p>
					</div>
				</div>
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
						<FormErrors errors={errors} />
						<ButtonFullWidth onClick={this._handleSubmit}>{t('submit')}</ButtonFullWidth>
					</div>
				</div>
			</div>
		);
	}

});

module.exports = FiveMinuteEnrollmentForm;
