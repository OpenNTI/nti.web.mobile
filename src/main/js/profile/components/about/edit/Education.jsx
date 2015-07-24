import React from 'react';
import EducationItem from './EducationItem';

export default React.createClass({
	displayName: 'Education:Edit',

	propTypes: {
		items: React.PropTypes.array.isRequired,
		onChange: React.PropTypes.func
	},

	getInitialState: function() {
		return {
			value: null 
		};
	},

	itemChanged(item, newValue) {
		if (this.props.onChange) {
			this.props.onChange(this.props.items);
		}
	},

	render () {
		let {items} = this.props;
		return (
			<div>
				{(items || []).map((item, index) => {
					return <EducationItem item={item} key={`ed-item-${index}`} onChange={this.itemChanged.bind(this, item)} />
				})}
			</div>

		);
	}
});
