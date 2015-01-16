/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Constants = require('../../Constants');
var Avatar = require('common/components/Avatar');
var DateTime = require('common/components/DateTime');
var DisplayName = require('common/components/DisplayName');
var Replies = require('../Replies');
var ModeledContentPanel = require('modeled-content').Panel;

var PostItem = React.createClass({

	displayName: 'PostListItem',
	mixins: [require('./Mixin')],

	statics: {
		inputType: [
			Constants.types.POST
		]
	},

	getInitialState: function() {
		return {
			showForm: false
		};
	},

	render: function() {
		var {item} = this.props;
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
						<ModeledContentPanel body={message} />
						{edited && <DateTime date={modifiedOn} format="LLL" prefix="Modified: "/>}
					</div>
				{canEdit &&
					<div className="footer">
						<a href="#" className="link edit">Edit</a>
						<a href="#" className="link delete">Delete</a>
					</div>
				}
				</div>
				<Replies item={item} childComponent={PostItem} topic={this.props.topic} />
			</div>
		);

	}

});

module.exports = PostItem;
