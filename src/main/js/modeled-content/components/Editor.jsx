'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'ModeledBodyContentEditor',

	getValue () {
		return this.refs.editor.getDOMNode().value;
	},

	render () {
		return (
			<textarea {...this.props} ref="editor"/>
		);
	}
});
