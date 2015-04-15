


var React = require('react');
var _formConfig = require('../configs/GiftRedeem');
var FieldRender = require('common/forms/mixins/RenderFormConfigMixin');
var FormPanel = require('common/forms/components/FormPanel');
var FormErrors = require('common/forms/components/FormErrors');
var Loading = require('common/components/Loading');
var EnrollmentSuccess = require('../../components/EnrollmentSuccess');
var t = require('common/locale').scoped('ENROLLMENT.GIFT.REDEEM');
var Actions = require('../Actions');
var Store = require('../Store');
var Constants = require('../Constants');


var GiftRedeem = React.createClass({

	mixins: [FieldRender],

	getInitialState: function() {
		return {
			fieldValues: {},
			errors: {},
			busy: false,
			success: false
		};
	},

	componentWillMount: function() {
		this.setState({
			fieldValues: {
				accessKey: this.props.code || ''
			}
		});
	},

	componentDidMount: function() {
		Store.addChangeListener(this.onStoreChange);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this.onStoreChange);
	},

	onStoreChange: function(event) {
		switch( (event||{}).type ) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case Constants.INVALID_GIFT_CODE:
				this.setState({
					busy: false,
					errors: {
						accessKey: {
							message: event.reason
						}
					}
				});
			break;
			case Constants.GIFT_CODE_REDEEMED:
				this.setState({
					busy: false,
					success: true,
					errors: {}
				});
			break;
		}
	},

	_handleSubmit: function(event) {
		event.preventDefault();
		this.setState({
			busy: true
		});
		Actions.redeemGift(this.props.purchasable, this.state.fieldValues.accessKey);
	},

	_inputChanged: function(event) {
		this.updateFieldValueState(event);
	},

	render: function() {

		if (this.state.busy) {
			return <Loading />;
		}

		if (this.state.success) {
			return (<EnrollmentSuccess courseTitle={this.props.purchasable.Title} />);
		}

		var title = t('formTitle');

		var buttonLabel = t('redeemButton');

		var errors = this.state.errors;

		var disabled = (this.state.fieldValues.accessKey||'').trim().length === 0;

		return (
			<FormPanel title={title} onSubmit={this._handleSubmit}>
				{this.renderFormConfig(_formConfig, this.state.fieldValues, t)}
				<FormErrors errors={errors} />
				<input type="submit"
					key="submit"
					disabled={disabled}
					id="redeem:submit"
					className="small-12 columns tiny button radius"
					value={buttonLabel} />
			</FormPanel>

		);
	}

});

module.exports = GiftRedeem;
