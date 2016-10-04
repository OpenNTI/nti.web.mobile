import React from 'react';

import {buffer} from 'nti-commons';

import {ActiveState} from 'nti-web-commons';

import {StoreEventsMixin} from 'nti-lib-store';

import NavStore from '../Store';

export default React.createClass({
	displayName: 'Breadcrumb',
	mixins: [StoreEventsMixin],

	propTypes: {
		children: React.PropTypes.any
	},

	backingStore: NavStore,
	backingStoreEventHandlers: {
		default: buffer(10, function () {
			this.applyContext();
		})
	},


	getInitialState () {
		return {
			path: []
		};
	},

	componentDidMount () {
		this.applyContext();
	},

	componentWillReceiveProps () {
		this.applyContext();
	},


	applyContext () {
		this.setState(NavStore.getData());
	},


	render () {
		let {path = []} = this.state;

		return (
			<ul className="breadcrumbs" role="menubar" aria-label="breadcrumbs">
				{this.props.children}
				{path.slice(-2).map((o, i)=>this.renderItem(o, !o.href, i))}
			</ul>
		);
	},


	renderMenu (items, className) {
		if (!items || !items.length) {
			return null;
		}
		return (
			<ul className={className} role="menu" aria-label="menu">
				{items.map((o, i) => this.renderItem(o, !o.href, i))}
			</ul>
		);
	},


	renderItem (item, disabled, index) {
		let className = disabled ? 'unavailable' : null;

		disabled = disabled ? 'true' : null;//don't include the attribute
		return (
			<ActiveState tag="li" href={item.href}
				key={index}
				role="menuitem"
				className={className}
				activeClassName="current"
				aria-disabled={disabled}>
				<a href={item.href}>{item.label}</a>
				{this.renderMenu(item.children, 'menu')}
			</ActiveState>
		);
	}
});
