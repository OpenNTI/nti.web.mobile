'use strict';

import React from 'react';
import Actions from '../Actions';
import Constants from '../Constants';
import Store from '../Store';


let Replies = React.createClass({

	propTypes: {
		topic: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {
			replies: null,
			display: false,
			showForm: false
		};
	},

	componentDidMount: function() {
		this._getReplies();
		Store.addChangeListener(this._storeChange);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChange);
	},

	// componentWillReceiveProps: function() {
	// 	console.debug('will receive props');
	// 	this._getReplies(true);
	// },

	_storeChange: function(event) {
		switch(event.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case Constants.GOT_COMMENT_REPLIES:
				if(event.comment === this.props.item) {
					let itemId = this.props.item.getID();
					this.setState({
						replies: (event.replies||[]).filter(item => (item.inReplyTo === itemId))
					});
				}
				break;

			case Constants.COMMENT_ADDED:
				let {item} = this.props;
				let {parent, result} = event.data;
				if (parent === item || result.inReplyTo === item.getID()) {
					this._getReplies(true);
				}
				break;

			case Constants.OBJECT_DELETED:
				let {item} = this.props;
				let eventItem = event.object || event.item;
				let parent = eventItem && eventItem.parent();
				// if the deleted item is a reply to our item, reload our children.
				if (parent && parent.getID && parent.getID() === item.getID()) {
					this._getReplies(true);
				}
				break;
		}
	},

	_getReplies: function(reload) {
		let {item} = this.props;
		if (item.ReferencedByCount === 0 && !reload) {
			return;
		}
		Actions.getCommentReplies(item);
	},

	_renderReplies: function() {
		if (!this.props.display) {
			return;
		}
		let items = (this.state.replies||[]);
		let Tag = this.props.childComponent;
		return items.map(reply => {
			return (<Tag
						{...this.props}
						key={reply.ID}
						item={reply} />);
		});
	},

	render: function() {
		return (
			<div className={this.props.className}>
				<div className="replies">
					
						{this._renderReplies()}
					
				</div>
			</div>
		);
	}

});

module.exports = Replies;
