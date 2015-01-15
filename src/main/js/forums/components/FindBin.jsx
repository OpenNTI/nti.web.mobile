/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Redirect = require('navigation/components/Redirect');
var NavigatableMixin = require('common/mixins/NavigatableMixin');
var NotFoundView = require('notfound/components/NotFoundView');
var NTIID = require('dataserverinterface/utils/ntiids');


function binHasForum(bin, forumId) {
	// keys in bin: Parent, Section
	return Object.keys(bin).some(boardName => {
		
		// Parent or Section with a 'forums' array property
		var b = bin[boardName];

		// does one of the forums have a matching id?
		return (b.forums||[]).some(forum => (forum.getID() === forumId));
	});
}

var FindBin = React.createClass({

	mixins: [NavigatableMixin],

	getInitialState: function() {
		return {
			location: null
		};
	},

	componentWillMount: function() {
		var bin = this.findBin(this.props.forumId);
		if (bin) {
			var p = this.getPath();
			var newPath = p.replace(/^\/jump/,'/'+bin);
			this.setState({
				location: newPath
			});
		}
	},

	findBin: function(forumId) {
		forumId = NTIID.decodeFromURI(forumId);
		var d = this.props.discussions;
		var result = null;
		Object.keys(d||{}).some(binName => {
			var bin = d[binName];
			if(binHasForum(bin,forumId)) {
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
