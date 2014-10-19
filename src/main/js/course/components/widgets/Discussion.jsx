/** @jsx React.DOM */
'use strict';

var React = require('react/addons');
var getService = require('common/Utils').getService;

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
			count: 0,
			icon: null,
			title: ''
		};
	},

	componentDidMount: function() {
		this.resolveIcon(this.props);
		this.resolveCommentCount();
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


	resolveCommentCount: function() {
		var item = this.props.item;
		var id = item && item.NTIID;

		getService().then(function(service){
			return service.getObject(id)
				.then(function(o) {
					if (this.isMounted()) {
						this.setState({
							title: o.title,
							count: o.PostCount || 0
						});
					}
				}.bind(this));
		}.bind(this));
	},


	render: function() {
		var props = this.props;
		var item = props.item;
		var title = item.title || this.state.title || 'Discussion';


		return (
			<div className={'overview-discussion'}>
				<img src={this.state.icon}></img>
				<div className="wrap">
					<div className="title">{title}</div>
					<div className="comments">{this.state.count + " Comments"}</div>
				</div>
			</div>
		);
	}
});
