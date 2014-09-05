/** @jsx React.DOM */

var React = require('react/addons');

var MainContentPanel = React.createClass({
	render: function() {
		if(this.props.loggedIn) {
			return (<div class="content">this is content</div>);
		}
		return (
			<div>
				<div>{this.props.loggedIn ? 'Yep' : 'Nope'}</div>
			</div>
		);
	}
});

module.exports = MainContentPanel;
