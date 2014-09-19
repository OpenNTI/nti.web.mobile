/** @jsx React.DOM */

var React = require('react/addons');
var LeftNav = require('./LeftNav');
var Footer = require('./Footer');

var Notifications = require('notifications');

var MessageDisplay = require('../messages').Display;

var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;

var Library = require('library');

var Navigation = require('navigation'); 

var t = require('../locale');

/**
 * Convenience function for constructing NavRecords
 */
function _navRec(basePath,opts) {
	return new Navigation.NavRecord({
		label:t(opts.label,{scope: 'NAV.Library'}),
		href: basePath + opts.href,
		clickable: opts.hasOwnProperty('clickable') ? opts.clickable : (opts.items && opts.items.length > 0),
		children: opts.children,
		badge: opts.items ? opts.items.length : null
	});
}

module.exports = React.createClass({
	displayName: 'AppContainer',

	propTypes: {
		basePath: React.PropTypes.string.isRequired
	},

	_libraryChanged: function() {

		var navitems = [];
		var library = Library.Store.getData();
		console.log('[AppContainer]: Library: %O', library);
		var courses = [].concat(library.courses || []);
		var basePath = this.props.basePath;
		navitems.push(_navRec(basePath,{
			label:'courses',
			href:'library/courses',
			items:courses
		}));

		var books = [].concat(library.bundles || [], library.packages || []);
		navitems.push(_navRec(basePath,{
			label:'books',
			href:'library/books',
			items:books
		}));

		navitems.push(_navRec(basePath,{
			label:'catalog',
			href:'catalog/',
			clickable: true
		}));

		var instructing = [].concat(library.coursesAdmin || []);
		if(instructing.length > 0) {
			navitems.push(_navRec(basePath,{
				label:'instructing',
				href:'library/admin',
				items:instructing
			}));
		}
		var n = _navRec( basePath, {
			label: 'library',
			children: navitems
		});
		Navigation.Actions.publishNav('root',n);
		// this.setState({leftNav: navitems});

	},

	_navChanged: function(evt) {
		this.setState({leftNav: Navigation.Store.getNav()});
	},

	getInitialState: function() {
		return {
			loggedIn: false,
			leftNav: []
		};
	},

	componentDidMount: function() {
		Library.Store.addChangeListener(this._libraryChanged);
		$(this.getDOMNode()).foundation({
			offcanvas: {
				// close_on_click: true
			}
		});
		Navigation.Store.addChangeListener(this._navChanged);
		Library.Store.getData(true);
	},

	componentWillUnmount: function() {
		Library.Store.removeChangeListener(this._libraryChanged);
		Navigation.Store.removeChangeListener(this._navChanged);
	},

	render: function() {
		return (
			<div className="app-container">
				<div className="off-canvas-wrap" data-offcanvas>
					<div className="inner-wrap">
						<nav className="tab-bar">
							<section className="left-small">
								<a href="#" id="left-menu" className="left-off-canvas-toggle menu-icon"><span></span></a>
							</section>
							<section className="middle tab-bar-section">
								<h1 className="title">next thought</h1>
							</section>
							<section className="right-small">
								<a className="right-off-canvas-toggle menu-icon" href="#"><span></span></a>
							</section>
						</nav>
						<aside className="left-off-canvas-menu">
							<LeftNav basePath={this.props.basePath} items={this.state.leftNav} backClick={function() {alert('hi')}}/>
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
