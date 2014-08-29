/** @jsx React.DOM */

var React = require('react/addons');

module.exports = React.createClass({
	getInitialState: function(){
		return {value: "Nothing selected"};
	},
	handleChange: function(event){
		this.setState({value: event.target.value});
		console.log(event);
	},
	render: function() {
		return (
			React.DOM.div(null, 
				React.DOM.select( {className:"course selector", onChange:this.handleChange}, 
					React.DOM.option( {value:"husker"}, "Chemistry of Beer"),
					React.DOM.option( {value:"starbuck"}, "Introduction to Water"),
					React.DOM.option( {value:"hotdog"}, "Intro to Human Physiology"),
					React.DOM.option( {value:"hotdog"}, "Law and Justice")
				),
				React.DOM.div(null, "Selected Course ", this.state.value)
			)
		);
	}
});
