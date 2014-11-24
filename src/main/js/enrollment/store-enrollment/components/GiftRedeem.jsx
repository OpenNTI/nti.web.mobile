/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var _formConfig = require('../configs/GiftRedeem');
var FieldRender = require('common/components/forms/mixins/RenderFieldConfigMixin');
var FormPanel = require('common/components/forms/FormPanel');
var t = require('common/locale').scoped('ENROLLMENT.GIFT.REDEEM');
var Actions = require('../Actions');
var Store = require('../Store');
var Constants = require('../Constants');


var GiftRedeem = React.createClass({

	mixins: [FieldRender],

	getInitialState: function() {
		return {
			fieldValues: {},
			errors: []
		};
	},

	componentDidMount: function() {
		Store.addChangeListener(this.onStoreChange);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this.onStoreChange);	
	},

	onStoreChange: function(event) {
		switch( (event||{}).type ) {
			case Constants.INVALID_GIFT_CODE:
				this.setState({
					errors: [event.reason]
				});
			break;
		}
	},

	_handleSubmit: function(event) {
		event.preventDefault();
		Actions.redeemGift(this.props.purchasable, this.state.fieldValues.accessKey);
	},

	render: function() {

		var title = t('formTitle');
		var fields = this.renderFormConfig(_formConfig, this.state.fieldValues, t);
		var buttonLabel = t('redeemButton');

		var errors = this.state.errors.map(function(err) {
			return <div className="error">{err}</div>;
		});

		return (
			<FormPanel title={title} onSubmit={this._handleSubmit}>
				{fields}
				{errors}
				<input type="submit"
					key="submit"
					id="redeem:submit"
					className="small-12 columns tiny button radius"
					value={buttonLabel} />
			</FormPanel>

		);
	}

});

module.exports = GiftRedeem;
