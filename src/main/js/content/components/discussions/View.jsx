import React from 'react';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import Detail from './Detail';

export default React.createClass({
	displayName: 'content:discussions:View',
	mixins: [
		ContextSender,
		NavigatableMixin
	],

	propTypes: {
		pageSource: React.PropTypes.object,

		item: React.PropTypes.object
	},


	componentDidMount () { this.updatePageSource(); },
	componentWillReceiveProps (props) { this.updatePageSource(props); },

	updatePageSource (props = this.props) {
		let {pageSource, item} = props;
		this.setPageSource(pageSource, item.getID());
	},


	getContext () {
		let {item} = this.props;

		return Promise.resolve({
			label: item.title || 'Note',
			href: this.makeHref(encodeForURI(item.getID()))
		});
	},


	render () {
		return ( <Detail {...this.props}/> );
	}
});
