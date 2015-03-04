'use strict';

import React from 'react';
import List from './List';

var TopicComments = React.createClass({

	render: function() {

		var {topic} = this.props;
		// var itemCount = topic.PostCount;
		let {Items} = this.props.container;
		return (
			(Items || []).length > 0 && 
			<section className="comments">
				<List className="forum-replies" {...this.props} itemProps={{topic: topic}} omitIfEmpty={true} />
			</section>
		);
	}
});

module.exports = TopicComments;
