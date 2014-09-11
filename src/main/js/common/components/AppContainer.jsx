/** @jsx React.DOM */

var React = require('react/addons');
var LeftNav = require('./LeftNav');
var Footer = require('./Footer');

var Notifications = require('../../notifications');

var MessageDisplay = require('../messages').Display;

var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;

var Library = require('../../library');

var NavRecord = require('../../navigation/NavRecord');

var t = require('../locale');

module.exports = React.createClass({
	displayName: 'AppContainer',

	propTypes: {
		basePath: React.PropTypes.string.isRequired
	},

	_libraryChanged: function() {
		var scope = {scope: 'NAV.Library'};

		var navitems = [];
		var library = Library.Store.getData();
		console.log('[AppContainer]: Library: %O', library);
		var courses = [].concat(library.courses || []);
		navitems.push(new NavRecord({
			label:t('courses', scope),
			href: this.props.basePath + 'library/courses',
			disabled: (courses.length == 0)
		}));

		var books = [].concat(library.bundles || [], library.packages || []);
		navitems.push(new NavRecord({
			label:t('books', scope),
			href:this.props.basePath + 'library/books',
			disabled: (books.length == 0)
		}));

		var instructing = [].concat(library.coursesAdmin || []);
		navitems.push(new NavRecord({
			label:t('instructing', scope),
			href:this.props.basePath + 'library/admin',
			disabled: (instructing.length == 0)
		}));

		this.setState({leftNav: navitems});

	},

	getInitialState: function() {
		return {
			loggedIn: false,
			leftNav: []
		};
	},

	componentDidMount: function() {
		Library.Store.addChangeListener(this._libraryChanged);
		$(this.getDOMNode()).foundation();
		Library.Store.getData(true);
	},

	componentWillUnmount: function() {
		Library.Store.removeChangeListener(this._libraryChanged);
	},

	render: function() {
		return (
			<div className="app-container">
				<div className="off-canvas-wrap" data-offcanvas>
					<div className="inner-wrap">
						<nav className="tab-bar">
							<section className="left-small">
								<a href="#" className="left-off-canvas-toggle menu-icon"><span></span></a>
							</section>
							<section className="middle tab-bar-section">
								<h1 className="title">next thought</h1>
							</section>
							<section className="right-small">
								<a className="right-off-canvas-toggle menu-icon" href="#"><span></span></a>
							</section>
						</nav>
						<aside className="left-off-canvas-menu">
							<LeftNav basePath={this.props.basePath} items={this.state.leftNav}/>
						</aside>
						<aside className="right-off-canvas-menu">
							<Notifications.View/>
						</aside>

						<section className="main-section">
							<MessageDisplay />
								{this.props.children}
							<Footer />
						</section>

						<a className="exit-off-canvas"></a>
					</div>
				</div>
			</div>
		);
	}
});
