'use strict';

var Api = require('../Api');
var Store = require('../Store');
var Constants = require('../Constants');

var NTIID = require('dataserverinterface/utils/ntiids');

module.exports = {
	componentDidMount: function() {
		Store.addChangeListener(this._storeChanged);
		this._loadData(this.props.forumId);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this._storeChanged);
	},

	componentWillReceiveProps: function(nextProps) {
		if (nextProps.forumId !== this.props.forumId) {
			this._loadData(nextProps.forumId);
		}
	},

	_storeChanged: function(event) {
		switch(event.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			// case Constants.OBJECT_LOADED:
			case Constants.OBJECT_CONTENTS_CHANGED:
				var {forumId} = this.props;
				if (NTIID.decodeFromURI(event.objectId) === NTIID.decodeFromURI(forumId)) {
					this.setState({
						loading: false
					});
				}
				break;
		}
	},

	_loadData: function(forumId) {
		Api.getObjectContents(forumId)
		.then(result => {
			Store.setObject(forumId, result.object);
			Store.setObjectContents(forumId, result.contents);
		});
	},	
};
