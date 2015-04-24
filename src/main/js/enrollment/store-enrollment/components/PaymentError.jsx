import React from 'react';

import PanelButton from 'common/components/PanelButton';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import Store from '../Store';
import {resetProcess} from '../Actions';

export default React.createClass({
	displayName: 'PaymentError',
	mixins: [NavigatableMixin],

	propTypes: {
		courseTitle: React.PropTypes.string,
		isGift: React.PropTypes.bool
	},


	getInitialState () {
		return {};
	},


	componentWillMount () {
		let error = (Store.getPaymentResult()||{}).Error;
		let message = (error||{}).Message;
		if (message) {
			this.setState({
				message: message
			});
		}
	},


	errorMessage () {
		return this.state.message ? <p>{this.state.message}</p> : null;
	},


	onClick () {
		resetProcess({ gift: !!this.props.isGift });
	},


	render () {
		let courseTitle = this.props.courseTitle;

		return (
			<div className="small-12 columns">
				<PanelButton className="error" buttonClick={this.onClick}>
					<p>We were unable to process your enrollment for '{courseTitle}'.</p>
					{this.errorMessage()}
					<p>If this issue persists contact support.</p>
				</PanelButton>
			</div>
		);
	}

});
