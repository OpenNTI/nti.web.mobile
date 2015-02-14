import React from 'react/addons';

export default React.createClass({
	displayName: 'ContentWidgetUnknown',

	render () {
		var {type} = this.props.item;
		return (
			<div onClick={this._onClick}>Unknown Type: {type}</div>
		);
	},

	_onClick () {
		this._owner.setState({foobar: true});
	}
});
