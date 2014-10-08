/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var DefaultRoute = Router.NotFound;

var Store = require('../Store');
var Actions = require('../Actions');

var Collection = require('./Collection');

var CourseFilters = require('../CourseFilters');

module.exports = React.createClass({
	displayName: 'LibraryView',

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
			<Locations contextual>
				<Location path='/books*' handler={Collection} basePath={basePath}
					title='Books' list={books}/>
				<Location path='/courses*' handler={Collection} basePath={basePath}
					title='Courses' list={courses} filters={CourseFilters} />
				<Location path='/admin*' handler={Collection} basePath={basePath}
					title='Administered Courses' list={instructing}/>
				<DefaultRoute handler={this._reroute}/>
			</Locations>
	      </div>
	    );
	}
});
