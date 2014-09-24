'use strict';


module.exports = {
	statics: {
		handles: function(item) {
			var change = item;
			item = change.Item || change;
			if (item.MimeType.replace('application/vnd.nextthought.', '') === this.noteable_type) {
				return true;
			}
			return false;
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
		return this.state.item.CreatedTime;
	}
};
