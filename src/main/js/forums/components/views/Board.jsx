/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var List = require('../List');


module.exports = React.createClass({

	_renderList: function() {
		var {list} = this.props;
		if (!Array.isArray(list) || list.length === 0) {
			return <div>No Forums</div>;
		}
		return (
			<List container={{Items: list}} />
		);
	},

	render: function() {

		// if (this.state.loading) {
		// 	return <Loading />;
		// }

		// var container = this.state.contents;

		return (
			<nav className="forum">
				{this._renderList()}
			</nav>
		);
	}

});
