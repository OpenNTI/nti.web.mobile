import React from 'react';

import ContextReciever from '../mixins/ContextReciever';

import NavigationBar from 'navigation/components/Bar';

export default React.createClass({
	displayName: 'Page',
	mixins: [ContextReciever],

	propTypes: {
		pageContent: React.PropTypes.any
	},


	render () {
		let {title, pageContent, children} = this.props;
		let state = this.state || {};
		let Content = pageContent;

		let props = Object.assign({}, this.props, {
			availableSections: null,
			children: null,
			title: null
		});

		return (
			<div>
				<NavigationBar {...this.props} {...state}
					title={title} />
				{Content ?
					<Content {...props}/>
					:
					children
				}
			</div>
		);
	}
});
