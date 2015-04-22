import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

import Router, {Locations, Location, NotFound as DefaultRoute} from 'react-router-component';
import CaptureClicks from 'react-router-component/lib/CaptureClicks';

import {getServer} from 'common/utils';

import Loading from 'common/components/Loading';
import ErrorComponent from 'common/components/Error';

import Constants from 'enrollment/store-enrollment/Constants';
import Store from 'enrollment/store-enrollment/Store';

import Form from 'enrollment/store-enrollment/components/GiftView';

import Confirm from 'enrollment/store-enrollment/components/PaymentConfirm';
import Success from 'enrollment/store-enrollment/components/PaymentSuccess';
import PaymentError from 'enrollment/store-enrollment/components/PaymentError';

export default React.createClass({
	displayName: 'GiftingWidget',

	propTypes: {
		purchasableId: React.PropTypes.string.isRequired
	},

	getInitialState () {
		return {
			loading: true,
			purchasable: null
		};
	},

	componentWillMount () {
		Store.addChangeListener(this.onChange);

		let purchasableId = this.props.purchasableId;
		if (!purchasableId) {
			this.setState({
				loading: false,
				error: 'Missing ID'
			});
			return;
		}

		getServer().getPurchasables(purchasableId)
			.then(x => x.Items[0])
			.then(x => {
				this.setState({purchasable: x});
				return x;
			})
			.then(Store.priceItem.bind(Store))
			.then(pricedItem => {
				this.setState({
					loading: false,
					pricedItem: pricedItem
				});
			})
			.catch(reason => {
				this.setState({
					loading: false,
					error: reason
				});
			});
	},

	componentWillUnmount () {
		Store.removeChangeListener(this.onChange);
	},

	onChange (event) {
		let router = this.refs.router;

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
	},


	onDone () {
		window.top.location.href = 'https://historychannel.ou.edu';
	},


	onNavigation () {
		parent.postMessage('{"event": "navigation"}', '*');
	},


	render () {
		if(this.state.error) {
			return <div className="column"><ErrorComponent error={this.state.error} /></div>;
		}

		if(this.state.loading) {
			return <Loading />;
		}

		let purchasable = this.state.purchasable;
		let courseTitle = purchasable.Title;

		return (
			<CaptureClicks environment={Router.environment.hashEnvironment}>
				<ReactCSSTransitionGroup transitionName="loginforms">
					<Locations hash ref="router" onNavigation={this.onNavigation}>
						<Location path="/confirm/*" handler={Confirm} purchasable={purchasable}/>
						<Location path="/success/*" handler={Success} purchasable={purchasable} onDone={this.onDone} />
						<Location path="/error/*" handler={PaymentError} courseTitle={courseTitle} />
						<DefaultRoute handler={Form} purchasable={purchasable}/>
					</Locations>
				</ReactCSSTransitionGroup>
			</CaptureClicks>
		);
	}
});
