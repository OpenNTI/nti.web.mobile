/** @jsx React.DOM */
'use strict';

var React = require('react/addons');

var Avatar = require('common/components/Avatar');
var DateTime = require('common/components/DateTime');
var DisplayName = require('common/components/DisplayName');

module.exports = React.createClass({
	displayName: 'FeedbackListItem',

	render: function() {
		var item = this.props.item;
		var createdBy = item.Creator;
		var createdOn = item.getCreatedTime();
		var modifiedOn = item.getLastModified();
		var message = item.body;

		var edited = (Math.abs(modifiedOn - createdOn) > 0);
		var canEdit = item.hasLink('edit') && false;


		return (
			<div className="feedback item">
				<Avatar username={createdBy} className="avatar"/>
				<div className="wrap">
					<div className="meta">
						<DisplayName username={createdBy} className="name"/>
						<DateTime date={createdOn} relative={true}/>
					</div>
					<div className="message">
						<div dangerouslySetInnerHTML={{__html: message}}/>
						{edited && <DateTime date={modifiedOn} format="LLL" prefix="Modified: "/>}
					</div>
				{canEdit &&
					<div className="footer">
						<a href="#" className="link edit">Edit</a>
						<a href="#" className="link delete">Delete</a>
					</div>
				}
				</div>
			</div>
		);
	}
});
