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
		var change = this.props.item;
		var item = change.Item || change;
		var username = item.Creator;
		return {
			username: username,
			change: change,
			item: item
		};
	},

	getCreatedTime: function() {
		return this.state.item.CreatedTime * 1000;
	}
};
