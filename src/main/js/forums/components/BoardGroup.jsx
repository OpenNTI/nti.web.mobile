/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var List = require('./List');
var tt = require('common/locale').scoped('FORUMS.groupTitles');

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
				<h2>{tt(key.toLowerCase())}</h2>
				<ul className="forum-boards">
				{Object.keys(boards).map(boardName => {
					var board = boards[boardName];
					var forums = (board.forums||[]);
					return forums.length === 0 ? null : (
						<li key={boardName}>
							<p className="board-title">{tt(boardName.toLowerCase())}</p>
							<List container={{
								Items: forums
							}}/>
						</li>);
				})}
				</ul>
			</div>
		);
	}
});
