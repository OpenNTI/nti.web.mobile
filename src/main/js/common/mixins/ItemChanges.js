import React from 'react';

export default {
	propTypes: {
		item: React.PropTypes.object.isRequired
	},


	componentDidMount () {
		this.listen(this.props.item);
	},


	componentWillReceiveProps (nextProps) {
		this.stopListening(this.props.item);
		this.listen(nextProps.item);
	},


	componentWillUnmount () {
		this.stopListening(this.props.item);
	},


	listen (item) {
		item.addListener('changed', this.itemChanged);
	},


	stopListening (item) {
		item.removeListener('changed', this.itemChanged);
	},


	itemChanged () {
		this.forceUpdate();
	}
};
