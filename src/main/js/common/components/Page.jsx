import React from 'react';

import WantsPageSource from '../mixins/WantsPageSource';

import NavigationBar from 'navigation/components/Bar';

export default React.createClass({
	displayName: 'Page',
	mixins: [WantsPageSource],

	propTypes: {
		pageContent: React.PropTypes.func.isRequired
	},


	render () {
		let {pageSource, currentPage, navigatableContext} = this.state || {};
		let {title, pageContent, children} = this.props;
		let Content = pageContent;

		let props = Object.assign({}, this.props, {
			availableSections: null,
			children: null,
			title: null
		});

		if (!Content) {
			Content = 'div';
			props.children = children;
		}

		return (
			<div>
				<NavigationBar {...this.props}
					title={title}
					pageSource={pageSource}
					currentPage={currentPage}
					navigatableContext={navigatableContext}
					/>
				<Content {...props}/>
			</div>
		);
	}
});
