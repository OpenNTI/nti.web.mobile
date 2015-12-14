import React from 'react';
import Tabs from './Tabs';

export default React.createClass({
	displayName: 'Assignments:PageFrame',

	propTypes: {
		pageContent: React.PropTypes.any.isRequired
	},

	render () {

		let Content = this.props.pageContent;

		return (
			<div className="assignments-page-frame">
				<Tabs className="assignments-nav filters" />
				<Content {...this.props} />
			</div>
		);
	}
});
