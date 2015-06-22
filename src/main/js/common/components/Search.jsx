import React from 'react';

const stop = e => e.preventDefault();

export default React.createClass({
	displayName: 'Saerch',

	propTypes: {
		onChange: React.PropTypes.func,
		defaultValue: React.PropTypes.string
	},

	getInitialState () {
		return {
			value: ''
		};
	},


	getDefaultProps () {
		return {
			onChange: function() {}
		};
	},


	clearFilter () {
		this.setState({filter: undefined});
		React.findDOMNode(this.refs.filter).focus();
	},


	updateFilter (event) {
		let {onChange} = this.props;
		let {value} = event.target;
		clearTimeout(this.state.buffer);

		let buffer = setTimeout(()=>onChange(value), 300);

		this.setState({value, buffer});
	},

	render () {
		let {value} = this.state;
		return (
			<form onSubmit={stop} className="search">
				<input type="text"
					defaultValue={this.props.defaultValue}
					onChange={this.updateFilter}
					ref="filter"
					required
					value={value}
					/>
				<input type="reset" onClick={this.clearFilter}/>
			</form>
		);
	}
});
