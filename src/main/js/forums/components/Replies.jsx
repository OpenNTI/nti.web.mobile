/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Actions = require('../Actions');
var Constants = require('../Constants');
var Store = require('../Store');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;


var Replies = React.createClass({

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
			case Constants.GOT_COMMENT_REPLIES:
				if(event.comment === this.props.item) {
					var itemId = this.props.item.getID();
					this.setState({
						replies: (event.replies||[]).filter(item => (item.inReplyTo === itemId))
					});
				}
				break;

			case Constants.COMMENT_ADDED:
				var {item} = this.props;
				var {parent, result} = event.data;
				if (parent === item || result.inReplyTo === item.getID()) {
					this._getReplies(true);
				}
				break;

			case Constants.OBJECT_DELETED:
				var {item} = this.props;
				var eventItem = event.object || event.item;
				if (eventItem && eventItem._parent && eventItem._parent.getID() === item.getID()) {
					this._getReplies(true);
				}
				break;
		}
	},

	_getReplies: function(reload) {
		var {item} = this.props;
		if (item.ReferencedByCount === 0 && !reload) {
			return;
		}
		Actions.getCommentReplies(item);
	},

	_renderReplies: function() {
		if (!this.props.display) {
			return;
		}
		var items = (this.state.replies||[]);
		var Tag = this.props.childComponent;
		return items.map(reply => {
			return (<Tag
						{...this.props}
						key={reply.ID}
						item={reply} />);
		});
	},

	render: function() {
		return (
			<div className="replies-wrapper">
				<div className="replies">
					<ReactCSSTransitionGroup transitionName="forum-comments">
						{this._renderReplies()}
					</ReactCSSTransitionGroup>
				</div>
			</div>
		);
	}

});

module.exports = Replies;
