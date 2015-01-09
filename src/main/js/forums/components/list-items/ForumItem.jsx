'use strict';

var React = require('react/addons');
var Constants = require('../../Constants');
var LoadingInline = require('common/components/LoadingInline');
var NTIID = require('dataserverinterface/utils/ntiids');

/**
 * For lists of Forums, this is the row item.
 */
module.exports = React.createClass({
	displayName: 'ForumListItem',
	mixins: [require('./Mixin')],

	statics: {
		inputType: [
			Constants.types.FORUM
		]
	},

	getInitialState() {
		return {
			loading: true
		};
	},

	componentDidMount: function() {
		this._loadBoard(this.props.item);
	},

	componentWillReceiveProps: function(nextProps) {
		if (nextProps.item !== this.props.item) {
			this._loadBoard(nextProps.item);
		}
	},

	_loadBoard: function(forum) {
		forum.getBoard()
		.then(board => {
			this.setState({
				loading: false,
				board: board
			});
		});
	},

	_href: function() {
		var b = NTIID.encodeForURI(this.state.board.NTIID);
		var f = NTIID.encodeForURI(this.props.item.getID());
		return [b, f, ''].join('/');
	},

	render: function() {

		if (this.state.loading) {
			return <LoadingInline />;
		}
		var {item} = this.props;
		return (
			<div className="forum-item">
				<h3><a href={this._href()}>{item.title}</a></h3>
			</div>
		);
	}
});
