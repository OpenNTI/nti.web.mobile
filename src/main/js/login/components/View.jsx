'use strict';

var React = require('react/addons');
var ReactCSSTransitionGroup = require("react/lib/ReactCSSTransitionGroup");

var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var DefaultRoute = Router.NotFound;

var BasePathAware = require('common/mixins/BasePath');

var Loading = require('common/components/Loading');
var Redirect = require('navigation/components/Redirect');

var LoginForm = require('./LoginForm');
var ForgotForm = require('./ForgotForm');
var SignupForm = require('../signup/components/SignupForm');
var PasswordResetForm = require('./PasswordResetForm');
var SignupConfirm = require('./SignupConfirm');

var MessageDisplay = require('messages/components/Display');
var Constants = require('../Constants');

var Actions = require('../Actions');
var Store = require('../Store');
var StoreProperties = require('../StoreProperties');

var tg = require('common/locale').scoped('GLOBAL');
var QueryString = require('query-string');



var View = React.createClass({

	mixins: [BasePathAware, Router.NavigatableMixin], // needed for getPath() call we're using for the router's key.

	clearMessages: function() {
		Actions.clearErrors();
	},

	_storeChanged: function (event) {
		if (event.property === StoreProperties.links) {
			this.setState({
				links: event.value,
				initialized: true
			});
		}
	},

	getInitialState: function() {
		return {
			links: {},
			initialized: false
		};
	},

	componentDidMount: function() {
		var loc = global.location || {};
		var returnPath = QueryString.parse(loc.search).return;
		if (returnPath) {
			Actions.setReturnPath(returnPath);
		}
		Store.addChangeListener(this._storeChanged);//All React Class methods are "auto bound"
		Actions.begin();
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChanged);//this was blowing up.
	},

	render: function() {

		if (!this.state.initialized) {
			return (<Loading />);
		}

		var basePath = this.getBasePath();
		var loc = global.location || {};
		var returnPath;

		//FIXME: If this evaluates to true while the user is typing in their
		// info, and auto-redirects... that would be weird for the user. (this
		// happens when you are actually logged in but some how get presented
		// then login form... if the login form is presented we should commit to
		// it...)
		if (this.state.links[Constants.links.LOGIN_CONTINUE_LINK]) {
			returnPath = QueryString.parse(loc.search).return;
			return (<Redirect location={returnPath||basePath} force="true"/>);
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

module.exports = View;
