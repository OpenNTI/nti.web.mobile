import React from 'react';
import PanelButton from 'common/components/PanelButton';
import QueryString from 'query-string';

export default React.createClass({
	displayName: 'PaymentComplete',

	componentWillMount () {
		let loc = global.location || {};
		let paymentState = (QueryString.parse(loc.search).State || '').toLowerCase() === 'true';
		this.setState({
			paymentState: paymentState
		});
	},

	// if enrollment was successful we won't get here. there's an enrollment check
	// in a parent view that will render
	render () {

		let message = this.state.paymentState ? '' : 'Payment was not processed.';

		return (
			<PanelButton href="../../../" linkText='Go back'>
				{message}
			</PanelButton>
		);
	}

});
