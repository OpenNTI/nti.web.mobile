/** @jsx React.DOM */

var React = require('react/addons');

module.exports = React.createClass({
	render: function() {
		return (
			<li>
				<div className="cover">
					<img src={this.props.src}></img>
				</div>
				<div>
					<div>{this.props.title}</div>
				</div>
			</li>
		);
	}
});