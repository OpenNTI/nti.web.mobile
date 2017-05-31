import React from 'react';
import createReactClass from 'create-react-class';
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import {Locations, Location, NotFound as DefaultRoute} from 'react-router-component';

import Logger from 'nti-util-logger';

import {Error as ErrorMessage, Loading, Mixins} from 'nti-web-commons';


import LoginForm from './LoginForm';
import ForgotForm from './ForgotForm';
import SignupForm from '../signup/components/SignupForm';
import PasswordResetForm from './PasswordResetForm';
import SignupConfirm from './SignupConfirm';

import {begin} from '../Actions';
import Store from '../Store';

const logger = Logger.get('login:components:View');


export default createReactClass({
	displayName: 'LoginView',
	mixins: [Mixins.BasePath, Mixins.NavigatableMixin],

	componentDidMount () {
		begin().then(()=> this.forceUpdate(), this.setError);
	},


	setError (error) {
		logger.error(error);
		this.setState({error});
	},


	render () {

		if ((this.state || {}).error) {
			return (<ErrorMessage error="Could not communicate with servers. Please try again later."/>);
		}

		if (!Store.getData()) {
			return (<Loading.Mask />);
		}

		return (
			<ReactCSSTransitionGroup transitionName="fadeOutIn" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
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
