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
			<div>
				<select className="course selector" onChange={this.handleChange}>
					<option value="husker">Chemistry of Beer</option>
					<option value="starbuck">Introduction to Water</option>
					<option value="hotdog">Intro to Human Physiology</option>
					<option value="hotdog">Law and Justice</option>
				</select>
				<div>Selected Course {this.state.value}</div>
			</div>
		);
	}
});
