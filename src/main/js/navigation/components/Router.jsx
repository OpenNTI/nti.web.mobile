/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var Router = require('react-router-component');

//Main Views
var Login = require('../../login');
var Home = require('../../home');
var Library = require('../../library');
var Course = require('../../course');
var NotFound = require('../../notfound');

module.exports = React.createClass({

	render: function() {
		var basePath = this.props.basePath;
		console.log('basePath: %s', basePath);
		return (
			<Router.Locations path={this.props.path}>
				<Router.Location path={basePath + 'login/*'} handler={Login.LoginView} basePath={basePath}/>
				<Router.Location path={basePath + 'library/*'} handler={Library.View} basePath={basePath} />
				<Router.Location path={basePath + 'catalog(/:entry)(/*)'} handler={Home.View} basePath={basePath} />
				<Router.Location path={basePath + 'course(/:course)(/*)'} handler={Course.View} basePath={basePath} />
				<Router.Location path={basePath} handler={Home.View} />
				<Router.NotFound handler={NotFound.View} />
			</Router.Locations>
		);
	}

});
