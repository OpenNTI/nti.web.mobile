import React from 'react';

import ActiveState from './ActiveState';

export default React.createClass({
	displayName: 'Breadcrumb',

	statics: {
		noContextProvider () {
			return Promise.resolve([]);
		}
	},


	propTypes: {
		children: React.PropTypes.any
	},


	getInitialState () {
		return {
			context: []
		};
	},

	componentDidMount () {
		this.maybeUpdateContext(this.props);
	},


	componentWillUnmount () {},


	componentWillReceiveProps (props) {
		this.maybeUpdateContext(props);
	},


	maybeUpdateContext (props) {
		let promiseMaker = props.contextProvider;
		let stamp = Date.now();
		if (promiseMaker) {
			this.setState({contextTime: stamp});
			promiseMaker().then(this.applyContext.bind(this, stamp));
		}
	},


	applyContext (contextTime, context) {
		if (this.state.contextTime === contextTime && this.isMounted()) {
			this.setState({context: context});
		}
	},


	render () {
		let context = this.state.context.slice(-2);
		return (
			<ul className="breadcrumbs" role="menubar" aria-label="breadcrumbs">
				{this.props.children}
				{context.map((o, i)=>this.renderItem(o, !o.href, i))}
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
