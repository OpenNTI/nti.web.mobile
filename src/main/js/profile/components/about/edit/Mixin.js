import React from 'react';

export default {
	propTypes: {
		items: React.PropTypes.array.isRequired,
		onChange: React.PropTypes.func
	},

	getInitialState: function() {
		return {
			items: []
		};
	},

	componentWillMount: function() {
		this.setState({
			items: this.props.items
		});
	},

	componentWillReceiveProps: function(nextProps) {
		this.setState({
			items: nextProps.items
		});
	},

	itemChanged(/* item, newValue */) {
		if (this.props.onChange) {
			this.props.onChange(this.props.items);
		}
	},

	addEntry () {
		this.state.items.push({
			MimeType: this.getMimeType()
		});
		this.forceUpdate();
	},

	removeEntry (index) {
		this.state.items.splice(index, 1);
		this.itemChanged();
	}
};
