'use strict';

var React = require('react/addons');

var Avatar = require('common/components/Avatar');
var DateTime = require('common/components/DateTime');
var DisplayName = require('common/components/DisplayName');
var Loading = require('common/components/LoadingInline');

var ModeledContentPanel = require('modeled-content').Panel;

var TopicHeadline = React.createClass({

	propTypes: {
		item: React.PropTypes.shape({
			Creator: React.PropTypes.string,
			body: React.PropTypes.array,
			title: React.PropTypes.string,
			getCreatedTime: React.PropTypes.func
		})
	},

	render: function() {
		var {item} = this.props;
		if (!item) {
			return <Loading />;
		}

		return (
			<div className="headline post">
				<Avatar className="avatar" username={item.Creator}/>
				<div className="wrap">
					<h1>{item.title}</h1>
					<div className="meta">
						<DisplayName username={item.Creator}/>{" · "}<DateTime date={item.getCreatedTime()} relative={true}/>
					</div>
				</div>
				<ModeledContentPanel body={item.body} />
			</div>
		);
	}

});

module.exports = TopicHeadline;
