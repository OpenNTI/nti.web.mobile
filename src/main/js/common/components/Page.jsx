import React from 'react';

import WantsPageSource from '../mixins/WantsPageSource';

import NavigationBar from 'navigation/components/Bar';

export default React.createClass({
	displayName: 'Course:Page',
	mixins: [WantsPageSource],

	propTypes: {
		pageContent: React.PropTypes.func.isRequired
	},


	render () {
		let {pageSource, currentPage, navigatableContext} = this.state || {};
		let {title, pageContent} = this.props;
		let Content = pageContent;

		return (
			<div>
				<NavigationBar {...this.props}
					title={title}
					pageSource={pageSource}
					currentPage={currentPage}
					navigatableContext={navigatableContext}
					/>
				<Content {...this.props}/>
			</div>
		);
	}
});
