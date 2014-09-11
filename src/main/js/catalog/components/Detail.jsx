/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var Loading = require('../../common/components/Loading');

var Actions = require('../Actions');
var Store = require('../Store');

var Title = require('./Title');
var Description = require('./Description');
var Instructors = require('./Instructors');

module.exports = React.createClass({
	displayName: 'Detail',
	propTypes: {
		entry: React.PropTypes.string.isRequired
	},

	getInitialState: function() {
		return {
			loading: true
		};
	},


	componentDidMount: function() {
		Store.addChangeListener(this._onChange);
		this.getDataIfNeeded(this.props);
	},


	componentWillUnmount: function() {
		Store.removeChangeListener(this._onChange);
	},


	componentWillReceiveProps: function(nextProps) {
		if (nextProps.entry !== this.props.entry) {
			this.getDataIfNeeded(nextProps);
		}
	},


	getDataIfNeeded: function(props) {
		var entryId = decodeURIComponent(props.entry);
		var entry = Store.getEntry(entryId);

		this.setState({
			loading: !entry,
			entry: entry
		});
	},


	_onChange: function() {
		this.getDataIfNeeded(this.props);
	},


	render: function() {
		if (this.state.loading) {
			return (<Loading/>);
		}

		var entry = this.state.entry;
		return (
			<div className="course-detail-view">
				<a href="./" className="back">Back</a>
				<Title entry={entry} />
				<Description entry={entry} />
				<Instructors entry={entry}/>
				<div className="footer"/>
			</div>
		);
	}
});
