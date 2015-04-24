import React from 'react';
import PanelButton from 'common/components/PanelButton';
import {scoped} from 'common/locale';
import Actions from '../Actions';
import Err from 'common/components/Error';
import Loading from 'common/components/Loading';
import NavigatableMixin from 'common/mixins/NavigatableMixin';
import Store from '../Store';
import {PAY_AND_ENROLL_ERROR} from '../Constants';

const t = scoped('ENROLLMENT');

export default React.createClass({
	displayName: 'Payment',

	mixins: [NavigatableMixin],

	propTypes: {
		paymentLink: React.PropTypes.string.isRequired, // dataserver pay and enroll link ('fmaep.pay.and.enroll')
		ntiCrn: React.PropTypes.string.isRequired, // passed to dataserver to get payment site url
		ntiTerm: React.PropTypes.string.isRequired // passed to dataserver to get payment site url
	},

	getInitialState () {
		return {
			loading: false
		};
	},

	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
	},

	componentWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
	},

	onStoreChange (event) {
		switch(event.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case PAY_AND_ENROLL_ERROR:
				this.setState({
					loading: false,
					error: event
				});
				break;
		}
	},

	buttonClick (event) {
		event.preventDefault();
		this.setState({
			loading: true
		});
		Actions.doExternalPayment({
			link: this.props.paymentLink,
			ntiCrn: this.props.ntiCrn,
			ntiTerm: this.props.ntiTerm,
			returnUrl: this.makeHref('/paymentcomplete/')
		});
	},

	render () {

		if (this.state.loading) {
			return <Loading />;
		}

		if (this.state.error) {
			return <Err error={this.state.error} />;
		}

		return (
			<PanelButton
				buttonClick={this.buttonClick}
				linkText={t("proceedToPayment")}>
					<span>You will be taken to a secure external site for payment.</span>
			</PanelButton>
		);
	}

});
