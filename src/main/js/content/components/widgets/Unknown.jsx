import React from 'react';

export default React.createClass({
	displayName: 'ContentWidgetUnknown',

	propTypes: {
		item: React.PropTypes.object
	},

	componentDidUpdate () {
		if (typeof document === 'undefined') { return; }

		let {type} = this.props.item;
		let dom = React.findDOMNode(this);

		if (dom) {
			dom.appendChild(
				document.createComment(`Unknown Type: ${type}`));
		}
	},

	render () {
		return (
			<error className="unsupported-content"><span>This content is not supported by your version of the application.</span></error>
		);
	}
});
