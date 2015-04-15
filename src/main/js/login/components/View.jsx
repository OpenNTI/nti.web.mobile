

import React from 'react';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

import Router from 'react-router-component';
let Locations = Router.Locations;
let Location = Router.Location;
let DefaultRoute = Router.NotFound;

import BasePathAware from 'common/mixins/BasePath';

import Loading from 'common/components/Loading';
import Redirect from 'navigation/components/Redirect';

import LoginForm from './LoginForm';
import ForgotForm from './ForgotForm';
import SignupForm from '../signup/components/SignupForm';
import PasswordResetForm from './PasswordResetForm';
import SignupConfirm from './SignupConfirm';

import MessageDisplay from 'messages/components/Display';
import * as Constants from '../Constants';

import {begin, clearErrors, setReturnPath} from '../Actions';
import Store from '../Store';
import StoreProperties from '../StoreProperties';

import {scoped} from 'common/locale';

let tg = scoped('GLOBAL');
import QueryString from 'query-string';


const storeChanged = '_storeChanged';

export default React.createClass({
	displayName: 'LoginView',

	mixins: [BasePathAware, Router.NavigatableMixin], // needed for getPath() call we're using for the router's key.

	clearMessages() {
		clearErrors();
	},

	[storeChanged] (event) {
		if (event.property === StoreProperties.links) {
			this.setState({
				links: event.value,
				initialized: true
			});
		}
	},

	getInitialState() {
		return {
			links: {},
			initialized: false
		};
	},

	componentDidMount() {
		let loc = global.location || {};
		let returnPath = QueryString.parse(loc.search).return;
		if (returnPath) {
			setReturnPath(returnPath);
		}
		Store.addChangeListener(this[storeChanged]);//All React Class methods are "auto bound"
		begin();
	},

	componentWillUnmount() {
		Store.removeChangeListener(this[storeChanged]);//this was blowing up.
	},

	render() {

		if (!this.state.initialized) {
			return (<Loading />);
		}

		let basePath = this.getBasePath();
		let loc = global.location || {};
		let returnPath;

		//FIXME: If this evaluates to true while the user is typing in their
		// info, and auto-redirects... that would be weird for the user. (this
		// happens when you are actually logged in but some how get presented
		// then login form... if the login form is presented we should commit to
		// it...)
		if (this.state.links[Constants.links.LOGIN_CONTINUE_LINK]) {
			returnPath = QueryString.parse(loc.search).return;
			return (<Redirect location={returnPath || basePath} force="true"/>);
		}

		return (
			<div>
				<nav className="top-bar">
					<ul className="title-area">
						<li className="name"><h1><a href="#">{tg('siteName')}</a></h1></li>
					</ul>
				</nav>
				<div className="loginformswrapper">
					<MessageDisplay category={Constants.messages.category} />
					<ReactCSSTransitionGroup transitionName="loginforms">
						<Locations
							contextual
							key={this.getPath()}>
							<DefaultRoute handler={LoginForm} />
							<Location path="/pwreset/:username/:token" handler={PasswordResetForm} links={this.state.links} />
							<Location path="/forgot/:param" handler={ForgotForm} links={this.state.links} />
							<Location path="/signup/confirm" handler={SignupConfirm} links={this.state.links} />
							<Location path="/signup/*" handler={SignupForm} links={this.state.links} />
						</Locations>
					</ReactCSSTransitionGroup>
				</div>
			</div>
		);
	}
});
