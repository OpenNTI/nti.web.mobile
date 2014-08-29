/** @jsx React.DOM */

var React = require('react/addons');

module.exports = React.createClass({
	render: function() {
		return (
			React.DOM.li(null, 
				React.DOM.div( {className:"cover"}, 
					React.DOM.img( {src:this.props.src})
				),
				React.DOM.div(null, 
					React.DOM.div(null, this.props.title)
				)
			)
		);
	}
});