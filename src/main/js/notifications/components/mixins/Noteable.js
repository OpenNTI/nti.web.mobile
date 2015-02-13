export default {
	statics: {
		handles (item) {
			var change = item;
			item = change.Item || change;
			item = item.MimeType.replace('application/vnd.nextthought.', '');

			if (!Array.isArray(this.noteableType)) {
				this.noteableType = [this.noteableType];
			}

			return (this.noteableType.indexOf(item) !== -1);
		}
	},

	getInitialState () { return {}; },

	componentWillMount () {
		var change = this.props.item;
		var item = change.Item || change;
		var username = item.Creator;
		this.setState({ username, change, item });
	},

	getEventTime () {
		var item = this.state.item;
		var change = this.state.change;

		return (getTime(item) || getTime(change)) * 1000;
	}
};


function getTime(o) {
	return o.CreatedTime || o['Last Modified'];
}
