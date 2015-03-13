import React from 'react';

import NavigationBar from 'navigation/components/Bar';

export default React.createClass({
	displayName: 'Page',

	propTypes: {
		pageContent: React.PropTypes.any
	},


	render () {
		let {title, pageContent, children} = this.props;
		let Content = pageContent;

		let props = Object.assign({}, this.props, {
			availableSections: null,
			children: null,
			title: null
		});

		return (
			<div>
				<NavigationBar title={title} {...props}/>
				{Content ?
					<Content {...props}/>
					:
					children
				}
			</div>
		);
	}
});
