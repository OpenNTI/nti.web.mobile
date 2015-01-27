'use strict';

var React = require('react/addons');

var Avatar = require('common/components/Avatar');
var DateTime = require('common/components/DateTime');
var DisplayName = require('common/components/DisplayName');

var ModeledContentPanel = require('modeled-content').Panel;

var TopicHeadline = React.createClass({

	propTypes: {
		post: React.PropTypes.shape({
			Creator: React.PropTypes.string,
			body: React.PropTypes.array,
			title: React.PropTypes.string,
			getCreatedTime: React.PropTypes.func
		})
	},

	render: function() {
		var {post} = this.props;
		if (!post) {
			post = {};
		}

		return (
			<div className="headline post">
				<Avatar className="avatar" username={post.Creator}/>
				<div className="wrap">
					<h1>{post.title}</h1>
					<div className="meta">
						<DisplayName username={post.Creator}/>{" · "}<DateTime date={post.getCreatedTime()} relative={true}/>
					</div>
				</div>
				<ModeledContentPanel body={post.body} />
			</div>
		);
	}

});

module.exports = TopicHeadline;
