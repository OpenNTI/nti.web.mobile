

var React = require('react');
var Actions = require('../../Actions');
var Notice = require('common/components/Notice');
var Button = require('common/forms/components/Button');
var Loading = require('common/components/Loading');

var DropOpen = React.createClass({

	getInitialState: function() {
		return {
			loading: false
		};
	},

	_cancelClicked: function() {
		history.back();
	},

	_confirmClicked: function() {
		this.setState({
			loading: true
		});
		Actions.dropCourse(this.props.courseId);
	},

	render: function() {

		if(this.state.loading) {
			return <Loading />;
		}

		return (
			<div>
				<Notice>Drop {this.props.courseTitle}?</Notice>
				<div className="small-12 columns">
					<Button onClick={this._cancelClicked} className="small-5 columns">Cancel</Button>
					<Button onClick={this._confirmClicked} className="small-5 columns">Drop course</Button>
				</div>
			</div>
		);
	}

});

module.exports = DropOpen;
