/** @jsx React.DOM */
//TODO
'use strict';

var React = require('react/addons');
var NoteableMixin = require('../mixins/Noteable');
var DateTime = require('common/components/DateTime');

module.exports = React.createClass({
	displayName: 'ForumCommentType',
	mixins: [NoteableMixin],

	statics: {
		noteableType: 'openbadges.badge'
	},

	render: function() {
		var item = (this.props.item || {}).Item;
		var badge = {
			backgroundImage: 'url(' + item.image + ')'
		};
		return (
			<li className="notification-item">
				<div className='badge' style={badge}/>
				<div className="wrap">
					{item.name}
					<DateTime date={this.getCreatedTime()} />
				</div>
			</li>
		);
	}
});
