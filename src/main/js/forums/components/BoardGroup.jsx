/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var List = require('./List');
var tt = require('common/locale').scoped('FORUMS.groupTitles');
var NTIID = require('dataserverinterface/utils/ntiids');

module.exports = React.createClass({

	propTypes: {
		group: React.PropTypes.shape({
			key: React.PropTypes.string,
			items: React.PropTypes.object
		})
	},

	render: function() {
		var {key, boards} = this.props.group;
		return (
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
		);
	}
});
