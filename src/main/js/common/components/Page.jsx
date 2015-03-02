import React from 'react';

import WantsPageSource from '../mixins/WantsPageSource';

import NavigationBar from 'navigation/components/Bar';

export default React.createClass({
	displayName: 'Course:Page',
	mixins: [WantsPageSource],

	propTypes: {
		pageContent: React.PropTypes.func.isRequired
	},


	componentWillReceiveProps () {
		this.setState({pageSource: null, currentPage: null});
	},


	render () {
		let {pageSource, currentPage} = this.state || {};
		let Content = this.props.pageContent;

		return (
			<div>
				<NavigationBar title="Lessons" {...this.props} pageSource={pageSource} currentPage={currentPage}/>
				<Content {...this.props}/>
			</div>
		);
	}
});
