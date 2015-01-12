/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Constants = require('../../Constants');
// var Avatar = require('common/components/Avatar');
var DateTime = require('common/components/DateTime');
var DisplayName = require('common/components/DisplayName');
var Actions = require('../../Actions');
var Store = require('../../Store');

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
			replies: null,
			displayReplies: true
		};
	},

	componentDidMount: function() {
		Store.addChangeListener(this._storeChange);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChange);
	},

	_storeChange: function(event) {
		if (event.type === Constants.GOT_COMMENT_REPLIES && event.comment === this.props.item) {
			this.setState({
				replies: event.replies,
				displayReplies: true
			});
		}
	},

	_toggleReplies: function(event) {
		event.preventDefault();
		event.stopPropagation();
		if (!this.state.replies) {
			this._getReplies();
		}
		else {
			var display = !this.state.displayReplies;
			this.setState({
				displayReplies: display
			});
		}
	},

	_getReplies: function() {
		var {item} = this.props;
		if (item.ReferencedByCount === 0) {
			return;
		}
		Actions.getCommentReplies(item);
	},

	_renderReplies: function() {
		if (!this.state.displayReplies) {
			return;
		}
		var items = (this.state.replies||{}).Items || [];
		return items.map(reply => {
			return <PostItem {...this.props} key={reply.ID} item={reply} />;
		});
	},

	render: function() {
		var {item} = this.props;

		return (
			<div className="reply">
				{/*<Avatar username={item.Creator} width="32" height="32"/>*/}
				<div className="body" dangerouslySetInnerHTML={{__html: item.body}}/>
				<div className="activity">
					<DisplayName username={item.Creator}/>
					<DateTime date={item.created} relative={true} />
					<div onClick={this._toggleReplies}>{item.ReferencedByCount} replies</div>
				</div>
				{this._renderReplies()}
			</div>
		);
	}

});

module.exports = PostItem;
