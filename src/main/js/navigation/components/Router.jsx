/**
 * @jsx React.DOM
 */
var React = require('react/addons');
var Router = require('react-router-component');

//Main Views
var LoginView = require('../../login').LoginView;
var HomeView = require('../../home').View;
var LibraryView = require('../../library').View;
var NotFoundView = require('../../notfound').View;

module.exports = React.createClass({

	render: function() {
		var basePath = this.props.basePath;
		console.log('basePath: %s', basePath);
		return (
			<Router.Locations path={this.props.path}>
				<Router.Location path={basePath + 'login/*'} handler={LoginView} basePath={basePath}/>
				<Router.Location path={basePath + 'library/*'} handler={LibraryView} basePath={basePath} />
				<Router.Location path={basePath} handler={HomeView} />
				<Router.NotFound handler={NotFoundView} />
			</Router.Locations>
		);
	}

});
