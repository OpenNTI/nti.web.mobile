import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Router, {Locations, Location, NotFound as DefaultRoute} from 'react-router-component';
import CaptureClicks from 'react-router-component/lib/CaptureClicks';
import {getService} from 'nti-web-client';
import {Loading, Error as ErrorComponent} from 'nti-web-commons';

import * as Constants from 'enrollment/store-enrollment/Constants';
import {priceItem} from 'enrollment/store-enrollment/Actions';
import Store from 'enrollment/store-enrollment/Store';
import Form from 'enrollment/store-enrollment/components/GiftView';
import Confirm from 'enrollment/store-enrollment/components/PaymentConfirm';
import Success from 'enrollment/store-enrollment/components/PaymentSuccess';
import PaymentError from 'enrollment/store-enrollment/components/PaymentError';


export default class GiftingWidget extends React.Component {

	static propTypes = {
		purchasableId: PropTypes.string.isRequired
	}

	state = {
		loading: true,
		purchasable: null
	}


	attachRouterRef = (x) => this.router = x


	componentWillMount () {
		Store.addChangeListener(this.onChange);

		let {purchasableId} = this.props;
		if (!purchasableId) {
			this.setState({
				loading: false,
				error: 'Missing ID'
			});
			return;
		}

		getService()
			.then(x => x.getPurchasables(purchasableId))
			.then(x => x[0] || Promise.reject(`Bad ID given: (${purchasableId})`))
			.then(x => {
				this.setState({purchasable: x});
				return x;
			})
			.then(priceItem)
			.then(pricedItem =>
				this.setState({ loading: false, pricedItem }))
			.catch(error =>
				this.setState({ loading: false, error }));
	}

	componentWillUnmount () {
		Store.removeChangeListener(this.onChange);
	}

	onChange = (event) => {
		let {router} = this;

		switch(event.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
		case Constants.PRICED_ITEM_RECEIVED:
			this.setState({
				loading: false,
				pricedItem: event.pricedItem
			});
			break;

		case Constants.EDIT:
			router.navigate('/');
			break;

		case Constants.RESET:
			router.navigate('/', {replace: true});
			break;

		case Constants.BILLING_INFO_VERIFIED:
			router.navigate('/confirm/');
			break;

		case Constants.STRIPE_PAYMENT_SUCCESS:
			router.navigate('/success/');
			break;

		case Constants.STRIPE_PAYMENT_FAILURE:
			router.navigate('/error/');
			break;
		}
	}

	onDone = () => {
		window.top.location.href = 'https://historychannel.ou.edu';
	}

	onNavigation = () => {
		window.parent.postMessage('{"event": "navigation"}', '*');
	}

	render () {
		if(this.state.error) {
			return <div className="column"><ErrorComponent error={this.state.error} /></div>;
		}

		if(this.state.loading) {
			return <Loading />;
		}

		const {purchasable} = this.state;
		const {title} = purchasable;

		return (
			<CaptureClicks environment={Router.environment.hashEnvironment}>
				<TransitionGroup>
					<CSSTransition timeout={500} classNames="fade-out-in" key={window.location.hash}>
						<Locations hash ref={this.attachRouterRef} onNavigation={this.onNavigation}>
							<Location path="/confirm/*" handler={Confirm} purchasable={purchasable}/>
							<Location path="/success/*" handler={Success} purchasable={purchasable} onDone={this.onDone} />
							<Location path="/error/*" handler={PaymentError} courseTitle={title} />
							<DefaultRoute handler={Form} purchasable={purchasable}/>
						</Locations>
					</CSSTransition>
				</TransitionGroup>
			</CaptureClicks>
		);
	}
}
