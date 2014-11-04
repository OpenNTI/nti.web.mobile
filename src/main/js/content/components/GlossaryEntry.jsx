/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var GlossaryEntry = React.createClass({

	componentDidMount: function() {
		var entryEl = document.getElementById(this.props.entryid);
		console.debug('didmount, %O',entryEl);
		if (entryEl) {
			this.getDOMNode().firstChild.innerHTML = entryEl.innerHTML;
		}
	},

	render: function() {
		return this.transferPropsTo(
			<div className="glossary-entry"><div className="def small-9 columns small-centered"></div></div>
		);
	}

});

module.exports = GlossaryEntry;
