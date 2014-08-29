/** @jsx React.DOM */

var React = require('react/addons');

module.exports = React.createClass({
	render: function() {
		return (
			React.DOM.a( {class:"th [2]", href:"http://www.priorityonejets.com/wp-content/uploads/2011/05/square_placeholder-small6.gif"}, 
				React.DOM.img( {src:"http://www.priorityonejets.com/wp-content/uploads/2011/05/square_placeholder-small6.gif"})
			)
		);
	}
});
