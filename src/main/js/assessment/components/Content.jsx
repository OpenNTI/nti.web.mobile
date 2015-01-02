'use strict';

var React = require('react/addons');

/**
 * Common component to render question and part content alike.
 * Keeping all assessment content-manipulation under one component.
 *
 * TODO: Implement Audio Snippets
 * maybe Sequences?
 */
module.exports = React.createClass({
	displayName: 'Content',

	render: function() {
		return (
			<div {...this.props} dangerouslySetInnerHTML={{__html: this.props.content}}/>
		);
	}
});
