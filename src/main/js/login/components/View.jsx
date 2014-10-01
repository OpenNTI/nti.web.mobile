/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var DefaultRoute = Router.NotFound;
var LoginForm = require('./LoginForm');
var ForgotForm = require('./ForgotForm');
var Store = require('../Store');
var StoreProperties = require('../StoreProperties');
var Actions = require('../Actions');
var Loading = require('common/components/Loading');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var View = React.createClass({

	mixins: [Router.NavigatableMixin],

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

		return (
			<div className="loginformswrapper">
				<ReactCSSTransitionGroup transitionName="loginforms">
					<Locations contextual key={this.getPath()}>
						<DefaultRoute handler={LoginForm} />
						<Location path="/forgot/:param" handler={ForgotForm} basePath={basePath} links={this.state.links} />
					</Locations>
				</ReactCSSTransitionGroup>
			</div>
		);
	}
});

module.exports = View;
