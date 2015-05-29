import React from 'react';

import {encodeForURI} from 'nti.lib.interfaces/utils/ntiids';

import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

export default React.createClass({
	displayName: 'content:discussions:Detail',
	mixins: [
		ContextSender,
		NavigatableMixin
	],

	propTypes: {
		pageSource: React.PropTypes.object,

		item: React.PropTypes.object
	},


	componentWillMount () {

	},


	getContext () {
		let {item} = this.props;

		return Promise.resolve({
			label: item.title || 'Note',
			href: this.makeHref(encodeForURI(item.getID()))
		});
	},


	componentDidMount () {
		this.updateData();
	},


	componentWillReceiveProps (nextProps) {
		this.updateData(nextProps);
	},


	updateData (props = this.props) {
		let {pageSource, item} = props;
		this.setPageSource(pageSource, item.getID());
	},


	render () {
		let {item} = this.props;

		return (
			<div>
				{item.getID()}
			</div>
		);
	}
});
