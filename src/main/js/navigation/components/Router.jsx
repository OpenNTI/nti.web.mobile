/**
 * @jsx React.DOM
 */
var React = require('react');

var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var NotFound = Router.NotFound;
var Environment = Router.environment;

//Lets try to make the "login" package conceal these details. We can make an extended "Locations" router that listens to login events and can know if we're logged in or not.
var Login = require('../../login');
var LoginView = Login.LoginView; //Can we get this down to just this? the View?
var LoginStore = Login.LoginStore;
var LoginStoreProperties = Login.LoginStoreProperties;

//Not sure this is needed...
var NavigationActions = require('../NavigationActions');
var NavigationConstants = require('../NavigationConstants');

//Main Views
var HomeView = require('../../home').View;
var LibraryView = require('../../library').View;
var NotFoundView = require('../../notfound').View;

var NTRouter = React.createClass({

	render: function() {
		var basePath = this.props.basePath;
		console.log('basePath: %s', basePath);
		return (
			<Locations path={this.props.path}>
				<Location path={basePath + 'login/*'} handler={LoginView} basePath={basePath}/>
				<Location path={basePath + 'library/*'} handler={LibraryView} basePath={basePath} />
				<Location path={basePath} handler={HomeView} />
				<NotFound handler={NotFoundView} />
			</Locations>
		);
	}

});

module.exports = NTRouter;
