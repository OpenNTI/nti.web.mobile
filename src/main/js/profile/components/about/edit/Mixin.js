import React from 'react';

export default {
	propTypes: {
		items: React.PropTypes.array.isRequired,
		onChange: React.PropTypes.func
	},

	getInitialState () {
		return {
			items: []
		};
	},

	componentWillMount () {
		this.setState({
			items: this.props.items
		});
	},

	componentWillReceiveProps (nextProps) {
		this.setState({
			items: nextProps.items
		});
	},

	itemChanged(/* item, newValue */) {
		if (this.props.onChange) {
			this.props.onChange(this.state.items);
		}
	},

	addEntry () {
		let {items} = this.state;
		items = items.slice();
		items.push({
			MimeType: this.getMimeType()
		});

		this.setState({items});
	},

	removeEntry (index) {
		let {items} = this.state;
		items = items.slice();

		items.splice(index, 1);
		this.setState({items});

		this.itemChanged();
	}
};
