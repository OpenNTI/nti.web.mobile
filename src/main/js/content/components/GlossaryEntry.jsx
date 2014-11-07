/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'GlossaryEntry',

	componentDidMount: function() {
		var entryEl = document.getElementById(this.props.entryid);
		console.debug('didmount, %O',entryEl);
		if (entryEl) {
			this.refs.content.getDOMNode().innerHTML = entryEl.innerHTML;
		}
	},

	render: function() {
		return this.transferPropsTo(
			<div className="glossary-entry"><div ref="content" className="def small-9 columns small-centered"></div></div>
		);
	}

});
