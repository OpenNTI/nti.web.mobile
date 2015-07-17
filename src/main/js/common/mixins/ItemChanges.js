import React from 'react';

function getItem (o, p) {
	if (o.getItem) {
		return o.getItem(p);
	}
	return p.item;
}

export default {
	propTypes: {
		item: React.PropTypes.object.isRequired
	},


	componentDidMount () {
		this.listen(getItem(this, this.props));
	},


	componentWillReceiveProps (nextProps) {
		this.stopListening(getItem(this, this.props));
		this.listen(getItem(this, nextProps));
	},


	componentWillUnmount () {
		this.stopListening(getItem(this, this.props));
	},


	listen (item) {
		item.addListener('change', this.itemChanged);
	},


	stopListening (item) {
		item.removeListener('change', this.itemChanged);
	},


	itemChanged () {
		if (this.onItemChanged) {
			this.onItemChanged();
		} else {
			this.forceUpdate();
		}
	}
};
