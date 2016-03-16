import React from 'react';
import Mixin from './Mixin';

import InterestListItem from './InterestListItem';

const COMMA = 188;
const RETURN = 13;

export default React.createClass({
	displayName: 'Interests:Edit',
	itemsArePrimitive: true,
	mixins: [Mixin],

	propTypes: {
		items: React.PropTypes.array,

		field: React.PropTypes.string
	},

	handleKeyDown (e) {
		if (e.keyCode === COMMA || e.keyCode === RETURN) {
			e.preventDefault();
			e.stopPropagation();
			this.maybeAddItem(e);
		}
	},

	maybeAddItem (e) {
		let {target} = e;
		let {value} = target;
		let {items} = this.state;
		items = items ? items.slice() : [];

		value = value.trim();
		if (value.length > 0 && items.indexOf(value) === -1) {

			items.push(value);

			this.setState({items});

			target.value = '';
			target.focus();
		}
	},

	remove (item) {
		let {items = []} = this.state || {};
		this.removeEntry(items.indexOf(item));
	},

	render () {

		let {items = []} = this.state || {};

		return (
			<div className="interests-edit">
				{items.map((item, index) => (
					<InterestListItem key={`item-${index}`} onRemove={this.remove} item={item} />
				))}

				<div className="string-item input">
					<input onBlur={this.maybeAddItem} onKeyDown={this.handleKeyDown}/>
				</div>
			</div>
		);
	}
});
