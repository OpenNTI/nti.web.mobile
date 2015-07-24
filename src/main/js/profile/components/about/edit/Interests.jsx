import React from 'react';
import Mixin from './Mixin';

export default React.createClass({
	displayName: 'Interests:Edit',

	mixins: [Mixin],

	propTypes: {
		items: React.PropTypes.array.isRequired
	},

	maybeAddItem (event) {
		let {value} = event.target;
		let {items} = this.state;
		value = value.trim();
		if (value.length > 0 && items.indexOf(value) === -1) {
			items.push(value);
			this.itemChanged();
			event.target.value = '';
			event.target.focus();
		}
	},

	render () {

		let {items} = this.state;

		return (
			<div className="interests-edit">
				{items.map((item, index) => <div key={`interest-item-${index}`} className="string-item">{item}<b onClick={this.removeEntry.bind(this, index)} className="remove icon-bold-x" /></div>)}
				<div className="string-item input"><input onBlur={this.maybeAddItem}/></div>
			</div>
		);
	}
});
