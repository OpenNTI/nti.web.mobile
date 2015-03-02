import React from 'react';

import WantsPageSource from 'common/mixins/WantsPageSource';

import NavigationBar from 'navigation/components/Bar';

export default React.createClass({
	displayName: 'Course:Page',
	mixins: [WantsPageSource],

	propTypes: {
		pageContent: React.PropTypes.func.isRequired
	},
	

	render () {
		let {pageSource} = this.state || {};
		let Content = this.props.pageContent;

		return (
			<div>
				<NavigationBar title="Lessons" {...this.props} pageSource={pageSource}/>
				<Content {...this.props}/>
			</div>
		);
	}
});
