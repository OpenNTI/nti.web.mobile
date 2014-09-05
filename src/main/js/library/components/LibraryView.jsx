/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var NotFound = Router.NotFound;

var Link = require('../../common/components/controls/link/HighlightedLink');

var Store = require('../LibraryStore');
var Actions = require('../LibraryActions');

var ContentView = require('./ContentView');

var Collection = require('./Collection');
var Course = require('./Course');


module.exports = React.createClass({

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
        var meta = Store.getData().metaData;
		if(/*some cond to check...*/ true) {
        	Actions.loadLibrary();
        }
    },


    _onChange: function() {
		this.setState({library: Store.getData()});
	},


	render: function() {
		var library = this.state.library;
		var books = [].concat(library.bundles || [], library.packages || []);
		var courses = [].concat(library.courses || []);
		var instructing = [].concat(library.coursesAdmin || []);

    	return (
	      <div>
			<div className="panel sticky">
				<nav class="top-bar" data-topbar role="navigation">
				<dl className="sub-nav" role="menu" title="">
					{books.length ? <Link role="menuitem" tag="dd" href={$AppConfig.basepath + 'library/'}><a href="#">Books</a></Link> : null}
					{courses.length ? <Link role="menuitem" tag="dd" href={$AppConfig.basepath + 'library/courses'}><a href="#">Courses</a></Link> : null}
					{instructing.length ? <Link role="menuitem" tag="dd" href={$AppConfig.basepath + 'library/admin'}><a href="#">Admin</a></Link> : null}
				</dl>
				</nav>
			</div>
			<Locations contextual>
				<Location path='/' handler={ContentView} title='Books' list={books}/>
				<Location path='/courses' handler={Collection} title='Courses' type={Course} list={courses}/>
				<Location path='/admin' handler={Collection} title='Administered Courses' type={Course} list={instructing}/>
			</Locations>
	      </div>
	    );
	}
});
