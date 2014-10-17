/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

module.exports = React.createClass({
	displayName: 'CourseOverviewDiscussion',

	statics: {
		mimeTest: /^application\/vnd\.nextthought\.discussion/i,
		handles: function(item) {
			return this.mimeTest.test(item.MimeType);
		}
	},

	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	getInitialState: function(){
		var i = this.props.item;
		return {
			icon: null
		};
	},

	componentDidMount: function() {
		this.resolveIcon(this.props);
	},

	resolveIcon: function(props) {
		this.setState({	icon: null	});
		if (!props.item.icon) {
			return;
		}

		props.course.resolveContentURL(props.item.icon)
			.then(function(u) {
				this.setState({
					iconResolved: true,
					icon: u
				});
			}.bind(this));
	},

	render: function() {
		var props = this.props;
		var item = props.item;
		var title = item.title||'Discussion';
		var numCommments = "[Number of]";
		return (
			<div className={'overview-discussion'}>
				<img src={this.state.icon}></img>
				<div className={'wrap'}>
					<div className='title'>{title}</div>
					<div className='comments'>{"[Number of] Comments"}</div>
				</div>
			</div>
		);
	}
});
