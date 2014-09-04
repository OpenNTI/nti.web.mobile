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

    	return (
	      <div>
			<ul className="button-group">
			  <li><Link baseClassName="button" activeClassName="secondary" href={$AppConfig.basepath + 'library/'}>Books</Link></li>
			  <li><Link baseClassName="button" activeClassName="secondary" href={$AppConfig.basepath + 'library/courses'}>Courses</Link></li>
			<li><Link baseClassName="button" activeClassName="secondary" href={$AppConfig.basepath + 'library/admin'}>Administered</Link></li>
			</ul>

			<Locations contextual>
				<Location path='/' handler={ContentView} title='Books' library={library}/>
				<Location path='/courses' handler={Collection} title='Courses' type={Course} list={library.courses}/>
				<Location path='/admin' handler={Collection} title='Administered Courses' type={Course} list={library.coursesAdmin}/>
			</Locations>
	      </div>
	    );
	}
});
