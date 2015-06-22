export default {
	statics: {
		handles (item) {
			let change = item;
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
		let change = this.props.item;
		let item = change.Item || change;
		let username = item.creator || item.Creator;
		this.setState({ username, change, item });
	},

	getEventTime () {
		let item = this.state.item;
		let change = this.state.change;

		return (getTime(item) || getTime(change)) * 1000;
	}
};


function getTime(o) {
	return o.CreatedTime || o['Last Modified'];
}
