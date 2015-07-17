// import React from 'react';

function getItem (o, p, ...r) {
	if (o.getItem) {
		return o.getItem(p, ...r);
	}
	return p.item;
}

export default {
	// propTypes: {
	// 	item: React.PropTypes.object.isRequired
	// },


	componentDidMount () {
		this.listen(getItem(this, this.props, this.state, this.context));
	},


	componentWillReceiveProps (...next) {
		let prev = [this.props, this.state, this.context];
		this.stopListening(getItem(this, ...prev));
		this.listen(getItem(this, ...next));
	},


	componentDidUpdate (...prev) {
		let next = [this.props, this.state, this.context];
		this.stopListening(getItem(this, ...prev));
		this.listen(getItem(this, ...next));
	},


	componentWillUnmount () {
		this.stopListening(getItem(this, this.props));
	},


	listen (item) {
		if (item) {
			item.addListener('change', this.itemChanged);
		}
	},


	stopListening (item) {
		if (item) {
			item.removeListener('change', this.itemChanged);
		}
	},


	itemChanged () {
		if (this.onItemChanged) {
			this.onItemChanged();
		} else {
			this.forceUpdate();
		}
	}
};
