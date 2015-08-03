

import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

import {NavigatableMixin, Locations, Location, NotFound as DefaultRoute} from 'react-router-component';

import BasePathAware from 'common/mixins/BasePath';

import ErrorMessage from 'common/components/Error';
import Loading from 'common/components/Loading';

import LoginForm from './LoginForm';
import ForgotForm from './ForgotForm';
import SignupForm from '../signup/components/SignupForm';
import PasswordResetForm from './PasswordResetForm';
import SignupConfirm from './SignupConfirm';

import {begin} from '../Actions';
import Store from '../Store';




export default React.createClass({
	displayName: 'LoginView',
	mixins: [BasePathAware, NavigatableMixin],

	componentDidMount () {
		begin().then(()=> this.forceUpdate(), this.setError);
	},


	setError (error) {
		console.error(error);
		this.setState({error});
	},


	render () {

		if ((this.state || {}).error) {
			return (<ErrorMessage error="Could not communicate with servers. Please try again later."/>);
		}

		if (!Store.getData()) {
			return (<Loading />);
		}

		return (
			<ReactCSSTransitionGroup transitionName="fadeOutIn">
				<Locations contextual key={this.getPath()}>
					<Location path="/pwreset/:username/:token" handler={PasswordResetForm}/>
					<Location path="/forgot/:param" handler={ForgotForm}/>
					<Location path="/signup/confirm" handler={SignupConfirm}/>
					<Location path="/signup/*" handler={SignupForm}/>
					<DefaultRoute handler={LoginForm} />
				</Locations>
			</ReactCSSTransitionGroup>
		);
	}
});
