/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var DefaultRoute = Router.NotFound;

var Link = require('../../common/components/controls/link/HighlightedLink');

var Store = require('../Store');
var Actions = require('../Actions');

var Collection = require('./Collection');

module.exports = React.createClass({
	displayName: 'NotificationView',

	getInitialState: function() {
        return { library: Store.getData() };
    },


    componentDidMount: function() {
        Store.addChangeListener(this._onChange);
        this.getDataIfNeeded(this.props);
    },


    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },


    componentWillReceiveProps: function(nextProps) {
        this.getDataIfNeeded(nextProps);
    },


    getDataIfNeeded: function(props) {
		if(!Store.getData().loaded) {
        	Actions.loadLibrary();
        }
    },


    _onChange: function() {
		this.setState({library: Store.getData()});
	},


	_reroute: function() {
		/*TODO: Pick a view to redirect to...*/
		return React.DOM.div({});
	},


	render: function() {
		var library = this.state.library;
		var books = [].concat(library.bundles || [], library.packages || []);
		var courses = [].concat(library.courses || []);
		var instructing = [].concat(library.coursesAdmin || []);

		var basePath = this.props.basePath;

    	return (
	      <div>
	      	{/*
			<div className="panel sticky">
				<nav data-topbar role="navigation">
				<dl className="sub-nav" role="menu" title="">
					{books.length ? <Link role="menuitem" tag="dd" href={basePath + 'library/'}><a href="#">Books</a></Link> : null}
					{courses.length ? <Link role="menuitem" tag="dd" href={basePath + 'library/courses'}><a href="#">Courses</a></Link> : null}
					{instructing.length ? <Link role="menuitem" tag="dd" href={basePath + 'library/admin'}><a href="#">Admin</a></Link> : null}
				</dl>
				</nav>
			</div>
			*/}
			<Locations contextual>
				<Location path='/books*' handler={Collection} basePath={basePath}
					title='Books' list={books}/>
				<Location path='/courses*' handler={Collection} basePath={basePath}
					title='Courses' list={courses}/>
				<Location path='/admin*' handler={Collection} basePath={basePath}
					title='Administered Courses' list={instructing}/>
				<DefaultRoute handler={this._reroute}/>
			</Locations>
	      </div>
	    );
	}
});
