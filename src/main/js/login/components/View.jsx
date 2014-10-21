/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var DefaultRoute = Router.NotFound;
var LoginForm = require('./LoginForm');
var ForgotForm = require('./ForgotForm');
var SignupForm = require('../signup/components/SignupForm');
var Store = require('../Store');
var StoreProperties = require('../StoreProperties');
var Actions = require('../Actions');
var Loading = require('common/components/Loading');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var Constants = require('../Constants');
var Globals = require('common/constants').Globals;
var MessageDisplay = require('common/messages/').Display;
var Redirect = require('common/components/Redirect');
var tg = require('common/locale').scoped('GLOBAL');

var View = React.createClass({

	mixins: [Router.NavigatableMixin], // needed for getPath() call we're using for the router's key.

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
		Store.addChangeListener(this._storeChanged);//All React Class methods are "auto bound"
		Actions.begin();
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChanged);//this was blowing up.
	},

	render: function() {

		if (!this.state.initialized) {
			return <Loading />
		}

		var basePath = this.props.basePath;

		if (this.state.links.hasOwnProperty(Constants.links.LOGIN_CONTINUE_LINK)) {
			return <Redirect location={basePath} />
		}

		return (
			<div className="loginformswrapper">
				<nav className="top-bar">
					<ul className="title-area">
						<li className="name"><h1><a href="#">{tg(Globals.SITE_NAME)}</a></h1></li>
					</ul>
				</nav>
				<MessageDisplay category={Constants.messages.category} />
				<ReactCSSTransitionGroup transitionName="loginforms">
					<Locations
						contextual
						key={this.getPath()}>
						<DefaultRoute handler={LoginForm} />
						<Location path="/forgot/:param" handler={ForgotForm} basePath={basePath} links={this.state.links} />
						<Location path="/signup/*" handler={SignupForm} basePath={basePath} links={this.state.links} />
					</Locations>
				</ReactCSSTransitionGroup>
			</div>
		);
	}
});

module.exports = View;
