'use strict';

import React from 'react';
import List from './List';

var TopicComments = React.createClass({

	render: function() {

		var {topic} = this.props;
		// var itemCount = topic.PostCount;

		return (
			<section className="comments">
				<List className="forum-replies" {...this.props} itemProps={{topic: topic}} />
			</section>
		);
	}
});

module.exports = TopicComments;
