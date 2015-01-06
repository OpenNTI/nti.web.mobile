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
		var {key, items} = this.props.group;
		return (
			<div>
				<h2>{tt(key.toLowerCase())}</h2>
				<ul className="forum-boards">
				{Object.keys(items).map(itemKey => {
					var item = items[itemKey];
					return item.length === 0 ? null : (
						<li>
							<p>{tt(itemKey.toLowerCase())}</p>
							<List container={{
								items: items[itemKey]
							}}/>
						</li>);
				})}
				</ul>
			</div>
		);
	}
});
