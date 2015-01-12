/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Redirect = require('navigation/components/Redirect');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var NotFoundView = require('notfound/components/NotFoundView');
var NTIID = require('dataserverinterface/utils/ntiids');

function binHasBoard(bin, boardId) {
	return Object.keys(bin).some(board => (bin[board].id === boardId));
}

var FindBin = React.createClass({

	mixins: [NavigatableMixin],

	getInitialState: function() {
		return {
			location: null
		};
	},

	componentWillMount: function() {
		var bin = this.findBin(this.props.boardId);
		if (bin) {
			var p = this.getPath();
			var newPath = p.replace(/^\/jump/,'/'+bin);
			this.setState({
				location: newPath
			});
		}
	},

	findBin: function(boardId) {
		boardId = NTIID.decodeFromURI(boardId);
		var d = this.props.discussions;
		var result = null;
		Object.keys(d||{}).some(binName => {
			var bin = d[binName];
			if(binHasBoard(bin,boardId)) {
				result = binName;
				return true;
			}
			return false;
		});

		return result;
	},

	render: function() {
		return (this.state.location ? <Redirect location={this.state.location} /> : <NotFoundView />);
	}

});

module.exports = FindBin;
