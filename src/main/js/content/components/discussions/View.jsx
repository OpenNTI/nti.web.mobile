import React from 'react';

import {decodeFromURI} from 'nti-lib-ntiids';

import ContextSender from 'common/mixins/ContextSender';
import NavigatableMixin from 'common/mixins/NavigatableMixin';

import NotFound from 'notfound/components/View';


import Detail from './Detail';

export default React.createClass({
	displayName: 'content:discussions:View',
	mixins: [
		ContextSender,
		NavigatableMixin
	],

	propTypes: {
		pageSource: React.PropTypes.object,
		store: React.PropTypes.object.isRequired,
		itemId: React.PropTypes.string.isRequired
	},


	getInitialState () {
		return {};
	},


	componentWillMount () { this.updateFromStore(); },
	componentWillReceiveProps (props) {
		const {itemId} = props;
		if (this.props.itemId !== itemId) {
			this.updateFromStore(props);
		}
	},

	updateFromStore (props = this.props) {
		const {store, pageSource, itemId: encodedId} = props;
		const itemId = decodeFromURI(encodedId);
		const item = store.get(itemId);

		this.setState({item, itemId}, () =>this.setPageSource(pageSource, itemId));
	},


	getContext () {
		const {state: {item, itemId: ntiid}, props: {itemId: encodedId}} = this;

		return {
			label: (item && item.title) || 'Note',
			href: this.makeHref(encodedId),
			ntiid
		};
	},


	render () {
		const {state: {item}} = this;

		return !item ? (
			<NotFound/>
		) : (
			<Detail item={item} {...this.props}/>
		);
	}
});
