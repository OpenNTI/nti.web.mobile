'use strict';

var React = require('react/addons');

var Collection = require('./Collection');
var CatalogEntryDetail = require('./CatalogEntryDetail');
var Store = require('../Store');
var Actions = require('../Actions');

var Loading = require('common/components/Loading');

var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;
var Enrollment = require('../../../enrollment').View;

var CatalogView = React.createClass({

	getInitialState: function() {
		//FIXME: Re-write this:
		// See: http://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html
		// Additional Node: On Mount and Recieve Props fill state (this is ment to be called one per CLASS lifetime not Instance lifetime)

        return { catalog: Store.getData() };
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


	getDataIfNeeded: function(/*props*/) {
		if(!Store.getData().loaded) {
        	Actions.loadCatalog();
        }
    },

    _onChange: function() {
		this.setState({catalog: Store.getData()});
	},


	shouldComponentUpdate: function(_, newState) {
		var newCatalog = this.state.catalog !== newState.catalog;

		var {router} = this.refs;
		var r = router || {refs: {}};
		var {enrollment} = r.refs;

		if (newCatalog && enrollment && enrollment.isMounted()) {
			return false;
		}

		return true;
	},


	render: function() {

        var catalog = this.state.catalog;
        var basePath = this.props.basePath;

        // console.log('CatalogView.props: %O',this.props);

		if (!catalog.loaded) {
			return (<Loading/>);
		}

        return (
			<Locations contextual={true} ref="router">
	            <Location
	                path="/item/:entryId/(#:nav)"
	                handler={CatalogEntryDetail}
	                basePath={basePath}
	            />
	            <Location
					ref="enrollment"
	                path="/item/:entryId/enrollment(/*)"
	                handler={Enrollment}
	                basePath={basePath}
	            />
	            <Location
	                path="*"
	                handler={Collection}
	                list={catalog}
	                basePath={this.props.basePath}
	                section="catalog"
	            />
			</Locations>
        );
	}

});

module.exports = CatalogView;
