/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var List = require('./List');
var tt = require('common/locale').scoped('FORUMS.groupTitles');
var NTIID = require('dataserverinterface/utils/ntiids');
var CollectionFilter = require('common/components/CollectionFilter');

module.exports = React.createClass({

	propTypes: {
		group: React.PropTypes.shape({
			key: React.PropTypes.string,
			items: React.PropTypes.object
		})
	},

	// var filters = {
	// 	'Upcoming': function(item) {
	// 		var startDate = new Date(item.StartDate);
	// 		var now = new Date();
	// 		return startDate > now;
	// 	},
	// 	'Current': function(item) {
	// 		var startDate = new Date(item.StartDate);
	// 		var endDate = new Date(item.EndDate);
	// 		var now = new Date();
	// 		return startDate < now && endDate > now;
	// 	},
	// 	'Archived': function(item) {
	// 		var endDate = new Date(item.EndDate);
	// 		var now = new Date();
	// 		return endDate < now;
	// 	}
	// };

	_filters(boards) {

		var filter = function(item) {
			console.debug(item);
			return item.board.id === item.forum.ContainerId;
		};

		var result = {};
		Object.keys(boards).forEach(boardName => {
			var board = boards[boardName];
			result[boardName] = {
				filter: filter,
				path: NTIID.encodeForURI(board.id) + '/'
			};
		});
		return result;
	},

	_flatList: function(boards) {
		var result = [];
		Object.keys(boards||{}).forEach(boardName => {
			var board = boards[boardName];
			var forums = board.forums||[];
			forums.forEach(f => {
				result.push({
					forum: f,
					board: board
				});
			});
		});
		return result;
	},

	render: function() {
		var {boards} = this.props.group;
		console.group('BoardGroup has these boards:');
		console.log(boards);
		console.groupEnd();
		return (
			<CollectionFilter filters={this._filters(boards)} list={this._flatList(boards)}>
				<div className='forum-board-group'>
					<ul className="forum-boards">
					{Object.keys(boards).map(boardName => {
						var board = boards[boardName];
						if (!board) {
							console.warn('Skipping. No board for name: ', boardName);
						}
						var forums = (board.forums||[]);
						var parentPath = NTIID.encodeForURI(board.id) || '';
						return forums.length === 0 ? null : (
							<li key={boardName}>
								<p className="board-title">{tt(boardName.toLowerCase())}</p>
								<List itemProps={{parentPath: parentPath}} container={{
									Items: forums
								}}/>
							</li>);
					})}
					</ul>
				</div>
			</CollectionFilter>
		);
	}
});
