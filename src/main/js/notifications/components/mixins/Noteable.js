'use strict';


module.exports = {
	statics: {
		handles: function(item) {
			var change = item;
			item = change.Item || change;
			item = item.MimeType.replace('application/vnd.nextthought.', '');

			if (!Array.isArray(this.noteableType)) {
				this.noteableType = [this.noteableType];
			}

			return (this.noteableType.indexOf(item) !== -1);
		}
	},

	getInitialState: function() {
		//FIXME: Re-write this:
		// See: http://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html
		// Additional Node: On Mount and Recieve Props fill state (this is ment to be called one per CLASS lifetime not Instance lifetime)
		
		var change = this.props.item;
		var item = change.Item || change;
		var username = item.Creator;
		return {
			username: username,
			change: change,
			item: item
		};
	},

	getEventTime: function() {
		var item = this.state.item;
		var change = this.state.change;

		return (getTime(item) || getTime(change)) * 1000;
	}
};


function getTime(o) {
	return o.CreatedTime || o['Last Modified'];
}
