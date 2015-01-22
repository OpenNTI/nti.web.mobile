'use strict';

var Store = require('../Store');
var Constants = require('../Constants');
var NTIID = require('dataserverinterface/utils/ntiids');

module.exports = {
	
	componentDidMount: function() {
		Store.addChangeListener(this.__storeChanged);
	},

	componentWillUnmount: function() {
		Store.removeChangeListener(this.__storeChanged);
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			busy: false,
			item: nextProps.item||this.props.item
		});
	},

	__storeChanged: function (event) {
		switch(event.type) {
		//TODO: remove all switch statements, replace with functional object literals. No new switch statements.
			case Constants.OBJECT_LOADED:
				var {object} = event;
				if (object && object.getID && object.getID() === this._itemId()) {
					this.setState({
						item: object
					});
				}
				break;
		}
	},

	_item: function() {
		return (this.state.item||this.props.item);
	},

	_itemId: function() {
		var i = this._item();
		var id = i && i.getID ? i.getID() : (this._getPropId ? this._getPropId() : null);
		return id && NTIID.decodeFromURI(id);
	}

};
