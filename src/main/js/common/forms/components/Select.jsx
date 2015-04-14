'use strict';

var React = require('react');
var Actions = require('../Actions');
var Store = require('../Store');
var Constants = require('../Constants');
var Loading = require('common/components/LoadingInline');

var Select = React.createClass({

	propTypes: {

		/**
		* the list of options for the select: an array of
		* objects with name and value properties
		* or an array of strings.
		*/
		options: React.PropTypes.array,

		/**
		* optionsLink property if provided should be an object
		* in the shape of:
		*   {
		* 	  type: 'rel',
		* 	  rel: 'fmaep.state.names'
		*   }
		* where rel is a reference to a Link available on User
		* This allows room for other types in the future (e.g. raw urls)
		*/
		optionsLink: React.PropTypes.object
	},

	getInitialState: function() {
		return {
			loading: false
		};
	},

	componentDidMount: function() {
		Store.addChangeListener(this.onStoreChange);
		if (this.props.optionsLink) {
			this.setState({
				loading: true
			});
			this.loadOptions();
		}
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this.onStoreChange);
	},

	loadOptions: function() {
		var link = this.props.optionsLink || {};
		if (link.type === 'rel' && link.rel) {
			Actions.loadSelectOptionsFromUserLinkRel(link.rel);
		}
		else {
			throw new Error(
				'loadOptions requires that this.props.optionsLink be an object with type:\'rel\' and ' +
				'a rel property for looking getting a link from user.'
			);
		}
	},

	onStoreChange: function(event) {
		var action = event.action || {};
		var rel = (action.payload || {}).link;
		if(event.type === Constants.URL_RETRIEVED && rel && this.props.optionsLink && rel === this.props.optionsLink.rel) {
			this.setState({
				loading: false,
				options: event.response
			});
		}
	},

	// if our options are simple strings turn them into objects
	// with name and value properties.
	_makeOption: function(option) {
		return typeof option === 'string' ? { name: option, value: option } : option;
	},

	_options: function() {
		var raw = this.state.options || this.props.options || [];
		var options = raw.map(function(item) {
			var option = this._makeOption(item);
			return <option value={option.value} key={option.value}>{option.name}</option>;
		}.bind(this));

		// include empty option
		options.unshift(<option value="" key="blank"></option>);

		return options;

	},

	render: function() {

		if (this.state.loading) {
			return <Loading />;
		}

		return (
			<label>
				<span>{this.props.field.label}</span>
				<select {...this.props}>
					{this._options()}
				</select>
			</label>
		);
	}

});

module.exports = Select;
