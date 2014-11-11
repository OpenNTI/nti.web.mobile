/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var RenderFieldConfigMixin = require('common/components/forms/mixins/RenderFieldConfigMixin');
var t = require('common/locale').scoped('ENROLLMENT.forms.storeenrollment');
var ScriptInjector = require('common/mixins/ScriptInjectorMixin');
var Loading = require('common/components/Loading');

var _fieldConfig = Object.freeze([
	{
		ref: 'name',
		type: 'text',
		required: true,
		placeholder: 'Name on card'
	},
	{
		ref: 'cardnumber',
		placeholder: '1234 1234 1234 1234',
		required: true
	},
	{
		ref: 'address',
		type: 'text',
		required: true,
		placeholder: 'Address'
	},
	{
		ref: 'address2',
		type: 'text',
		required: false,
		placeholder: 'Address (optional)'
	 },
	 {
		ref: 'city',
		type: 'text',
		required: true,
		placeholder: 'City'
	 },
	 {
		ref: 'state',
		type: 'text',
		required: true,
		placeholder: 'State/Province/Territory/Region'
	 },
	 {
		ref: 'country',
		type: 'text',
		required: true,
		placeholder: 'Country'
	 },
	 {
	 	ref: 'zip',
	 	type: 'text',
	 	required: true,
	 	placeholder: 'Zip/Postal Code'
	 }
]);

var Form = React.createClass({

	mixins: [RenderFieldConfigMixin,ScriptInjector],

	propTypes: {
		purchasable: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {
			loading: true,
			fieldValues: {}
		};
	},

	componentDidMount: function() {
		this.injectScript('https://js.stripe.com/v2/', 'Stripe')
			.then(function() {
				this.setState({
					loading: false
				});
			}.bind(this));
	},

	render: function() {

		if(this.state.loading) {
			return <Loading />;
		}

		var fieldRenderFn = this.renderField.bind(null,t,this.state.fieldValues);
		var title = this.props.purchasable.Name||null;

		return (
			<div className="row">
				<div className="column"><h2>{title}</h2></div>
				<form className="store-enrollment-form medium-6 medium-centered columns" onSubmit={this._handleSubmit}>
					<fieldset>
						<legend>Payment Information</legend>
						{_fieldConfig.map(fieldRenderFn)}
						<input type="submit"
							id="storeenroll:submit"
							className="small-12 columns tiny button radius"
							value="Continue to Enrollment" />
					</fieldset>
				</form>
			</div>
		);
	}

});

module.exports = Form;
